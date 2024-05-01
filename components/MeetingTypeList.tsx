'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { link } from 'fs';
import { useToast } from "@/components/ui/use-toast"

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState , setMeetingState] = useState<'is Schedule Meeting' | 'is Joining Meeting' | 'is Instant Meeting' | undefined>();
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
      dateTime:new Date(),
      description : '',
      link : '',
    })

    const [callDetails, setCallDetails] = useState<Call>()
    const { toast } = useToast()
    const createMeeting = async() => {
     if(!client || !user) return;
     
     try{
      if(!values.dateTime){
        toast({
          title: "Please select a date and time"})
          return;
      }
      
        const id = crypto.randomUUID();
        const call = client.call('default' , id);

        if(!call) throw new Error('Failed to create call');

        const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Instant Meeting';

        await call.getOrCreate({ 
          data:{
            starts_at:startsAt,
            custom:{
              description
            }
          }
        })
        setCallDetails(call);
        if(!values.description){
          router.push(`/meeting/${id}`);
        }
        toast({
          title: "Meeting Created"})
     }
     catch(error){
      console.log(error);
      toast({
        title: "Failed to create meeting",
      })
     }
    }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className='bg-yellow-1'
        handleClick={() => setMeetingState('is Instant Meeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('is Joining Meeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('is Schedule Meeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-green-1"
        handleClick={() => router.push('/recordings')}
      />

      <MeetingModal 
        isOpen={meetingState === 'is Instant Meeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

    </section>
  )
}

export default MeetingTypeList