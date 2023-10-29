import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import formatDateForInput from '../helpers/dateTimeInputFormat';
import { useAuthContext } from '../hooks/useAuthContext';
import RotateLoader from 'react-spinners/RotateLoader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UpdateSportEvent = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [sportEventName, setSportEventName] = useState('');
    const [eventStartDate, setSportEventStartDate] = useState('');
    const [eventEndDate, setSportEventEndDate] = useState('');
    const [eventName, setEventName ] = useState('');
    const [venue, setVenue ] = useState('');
    const [sportEventMedalCount , setSportEventMedalCount] = useState(null);
    const [eventID, setEventID ] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchSportEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/sport-events/${id}`);
                const name = response.data.sportEvent.name;
                const sportEventVenue = response.data.sportEvent.venue;
                const medalCount = response.data.sportEvent.medalCount;
                const startDate = response.data.sportEvent.startDate;
                const endDate = response.data.sportEvent.endDate;
                const ID = response.data.sportEvent.event._id;
                const eventname = response.data.sportEvent.event.name;
                setSportEventName(name);
                setVenue(sportEventVenue);
                setSportEventStartDate(formatDateForInput(startDate));
                setSportEventEndDate(formatDateForInput(endDate));
                setSportEventMedalCount(medalCount);
                setEventID(ID);
                setEventName(eventname);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchSportEvent();
    }, [id]);

    const handleUpdateSportEvent = async (e) => {
    e.preventDefault();
    
    if(!user) {
        return
    }

    const startDate = new Date(eventStartDate);
    const endDate = new Date(eventEndDate);

     try {
        setIsSubmitting(true);
        await axios.put(`http://localhost:8000/api/v1/sport-events/${id}`, {
            name: sportEventName,
            event: eventID,
            venue: venue,
            startDate: startDate,
            endDate: endDate,
            medalCount: sportEventMedalCount,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }); 
        setIsSubmitting(false);
        navigate(`/event/${eventID}/sportevents`);
        toast.info('Changes Successfull! 🎉', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000, // 3 seconds for the duration of notifacation display
        })
    } catch (error) {
        setIsSubmitting(false);
        console.log(error);
        toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
        });
    }
};  

if(loading) {
    return (
      <>
        <Navbar />
        <div className='mt-[15%] flex justify-center '>
          <RotateLoader
          color={'#00c237'}
          size={20}
          loading={loading}
          />
        </div>
      </>
    )
  }


  return (
    <div>
     <div className='bg-white'>
        <Navbar/>
    </div>   

    <h1 className='relative font-bold text-2xl 2xl:text-5xl text-center mt-4'>{eventName}</h1>
    <div className='container flex justify-center mt-5 bg-white w-[65%] rounded-xl animated-gradient-border 2xl:mt-16 2xl:w-[55%] '>
        <div className='flex justify-center relative w-[50%] bg-gray-400 rounded-l-lg'>
            <img className='absolute mt-14 w-96 h-80 object-cover' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-2xl font-bold'>Update sport event</h1>
            <form onSubmit={handleUpdateSportEvent} encType="multipart/form-data">
                <div className='flex flex-col mb-3'>
                    <label htmlFor="name" className='text-md 2xl:text-xl'>Event Name </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id="name" type="text" placeholder='Event Name' 
                    value={sportEventName}
                    onChange={(e) => {
                        setSportEventName(e.target.value)
                    }} />
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor="venue" className='text-md 2xl:text-xl'>Venue </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id="venue" type="text" placeholder='Event Name' 
                    value={venue}
                    onChange={(e) => {
                        setVenue(e.target.value)
                    }} />
                </div>
                
                <div className='flex gap-44'>
                <label htmlFor="start" className='text-md 2xl:text-xl'>Start </label>
                <label htmlFor="end" className='text-md 2xl:text-xl'>End </label>
                </div>
                
                <div className='flex mb-3 gap-1'>
                    
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="start" type="datetime-local"
                    value={eventStartDate}
                    style={{ fontSize: '14px' }}
                    onChange={(e) => {
                        setSportEventStartDate(e.target.value)
                    }} />

                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="end" type="datetime-local" 
                     value={eventEndDate}
                     style={{ fontSize: '14px' }}
                     onChange={(e) => {
                        setSportEventEndDate(e.target.value)
                     }}
                     />
                </div>
                {/* <div className='flex flex-col mb-3'>
                    <label htmlFor="end" className='text-md 2xl:text-xl'>End </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="end" type="datetime-local" 
                     value={eventEndDate}
                     onChange={(e) => {
                        setSportEventEndDate(e.target.value)
                     }}
                     />
                </div> */}
                <div className='flex flex-col mb-3'>
                    <label htmlFor="medal-count" className='text-md 2xl:text-xl'>Medal Count </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="medal-count" type="number" 
                     value={sportEventMedalCount} 
                     onChange={(e) => {
                      setSportEventMedalCount(e.target.value);
                     }}
                     />
                </div>
                <div class="pt-4 flex items-center space-x-4">
                <Link to={`/event/${eventID}/sportevents`} class="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
                <span class="material-symbols-outlined absolute left-10">
                close
                </span>
                    Cancel
                </Link>
                <button
                disabled={isSubmitting}
                 types='submit' class="bg-black flex justify-center items-center w-full text-white px-1 py-2 rounded-md focus:outline-none hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out"> Save
                </button>
                </div>
            </form>
        </div>
    </div>
    </div>
  )
}

export default UpdateSportEvent