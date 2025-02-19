import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Calendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import BookingForm from '../components/booking/BookingForm';
import PaymentModal from '../components/payment/PaymentModal';
import { useNavigate } from 'react-router-dom';
import { ServiceType, Doctor } from '../types';
import { fetchServices } from '../services/api';
import PatientDashboardLayout from '../components/layouts/PatientDashboardLayout';
import { toast } from 'react-hot-toast';

const BookAppointment: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [appointmentCost, setAppointmentCost] = useState<{
    isFree: boolean;
    price: number;
    remainingFreeAppointments: number;
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch services when component mounts
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const servicesData = await fetchServices();
        

        setServices(servicesData);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  
  // Fetch doctors when service is selected
  useEffect(() => {
    const fetchDoctors = async () => {
      if (selectedService) {
        try {
          const doctorPromises = selectedService.doctors.map(async (doctor) => {
            const response = await fetch(`http://localhost:5000/api/doctors/${doctor._id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            const result = await response.json();
            // Extract the doctor data from the response
            return result.data; // Access the doctor data from the 'data' property
          });

          const doctorsData = await Promise.all(doctorPromises);
          
          // Filter available doctors and ensure all required properties exist
          const availableDocs = doctorsData.filter((doctor) => 
            doctor && doctor.isAvailable
          );
          
          setAvailableDoctors(availableDocs);
        } catch (err) {
          console.error('Error fetching doctors:', err);
          setError('Failed to load doctors');
        }
      }
    };

    fetchDoctors();
  }, [selectedService]);

  const handleBookingSubmit = async (formData: any) => { 
    try {
      setIsLoading(true);
      
      if (!selectedDoctor || !selectedService || !selectedDate || !selectedTime) {
        toast.error('Please fill in all required fields');
        return;
      }

      // First check if payment is required
      const checkPaymentResponse = await fetch('http://localhost:5000/api/appointments/check-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          serviceId: selectedService._id 
        })
      });

      if (!checkPaymentResponse.ok) {
        throw new Error('Failed to check payment requirement');
      }

      const checkResult = await checkPaymentResponse.json();

      const appointmentData = {
        doctorId: selectedDoctor._id,
        serviceId: selectedService._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        patientNotes: formData.notes || ''
      };

      if (checkResult.requiresPayment) {
        // If payment required, store appointment data and show payment modal
        setPendingAppointment({
          ...appointmentData,
          amount: checkResult.amount
        });
        setShowPaymentModal(true);
      } else {
        // If free appointment (first 3), create appointment directly
        const createAppointmentResponse = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(appointmentData)
        });

        const appointmentResult = await createAppointmentResponse.json();

        if (!createAppointmentResponse.ok) {
          throw new Error(appointmentResult.message || 'Failed to create appointment');
        }

        toast.success('Free appointment booked successfully!');
        navigate('/patient/appointments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book appointment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to fetch appointment cost
  const fetchAppointmentCost = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/appointments/calculate-cost/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAppointmentCost(data);
    } catch (error) {
      console.error('Error fetching appointment cost:', error);
    }
  };

  return (
    <PatientDashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-white">Book an Appointment</h1>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Service Selection */}
          <div>
            <h2 className="text-lg font-medium text-white mb-4">Select Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services?.map((service) =>{
          
                return  <button
                key={service.specialization}
                onClick={() => setSelectedService(service)}
                className={`p-4 rounded-xl border ${
                  selectedService?.specialization === service.specialization
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-700 hover:border-emerald-500/50'
                }`}
              >
                <h3 className="text-white font-medium">{service.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                  {service.doctors.length} {service.doctors.length === 1 ? 'doctor' : 'doctors'} available
                </p>
              </button>
              })}
            </div>
          </div>

          {/* Doctor Selection */}
          {selectedService && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-white mb-4">Select Doctor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDoctors.map((doctor) => {
                
                return  <button
                  key={doctor._id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-4 rounded-xl border ${
                    selectedDoctor?._id === doctor._id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-emerald-500/50'
                  }`}
                >
                  <h3 className="text-white font-medium">{doctor.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{doctor.specialization}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Duration: {selectedService.duration} minutes
                  </p>
                </button>
                })}
              </div>
            </div>
          )}

          {/* Date and Time Selection */}
          {selectedDoctor && (
            <>
              <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              {selectedDate && (
                <TimeSlots
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  doctorId={selectedDoctor._id}
                  date={selectedDate}
                />
              )}
            </>
          )}

          {/* Booking Form */}
          {selectedTime && (
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedService={selectedService}
              selectedDoctor={selectedDoctor}
              onSubmit={handleBookingSubmit}
              isLoading={isLoading}
            />
          )}

          {/* Appointment Cost */}
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Appointment Cost</h3>
            {appointmentCost && (
              <div className="mt-2">
                {appointmentCost.isFree ? (
                  <div className="text-green-600">
                    This is a free appointment! You have {appointmentCost.remainingFreeAppointments} free appointments remaining.
                  </div>
                ) : (
                  <div className="text-gray-600">
                    Consultation fee: ${selectedService?.price}
                    <p className="text-sm text-gray-500">You have used all your free appointments.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && pendingAppointment && (
          <PaymentModal
            appointmentData={pendingAppointment}
            amount={selectedService?.price || 0}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </PatientDashboardLayout>
  );
};

export default BookAppointment; 