import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton';
import Spinner from '../components/shared/Spinner';
import { getTicket, reset } from '../features/ticket/ticketSlice';

function Ticket() {
  const { ticket, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.tickets
  );
  const params = useParams();
  const dispatch = useDispatch();
  const { ticketId } = useParams();
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getTicket(ticketId));
  }, [isError, message, ticketId]);

  if (isLoading) {
    <Spinner />;
  }
  if (isError) {
    <h3>Something went wrong</h3>;
  }

  return (
    <div className='ticket-page'>
      <div className='ticket-header'>
        <BackButton url='/tickets' />
        <h2>
          Ticket ID : {ticket.ticket._id}
          <span className={`status status-${ticket.ticket.status}`}>
            {ticket.ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted :
          {new Date(ticket.ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <hr />
        <div className='ticket-desc'>
          <h3>Description of Issue</h3>
          <p>{ticket.ticket.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
