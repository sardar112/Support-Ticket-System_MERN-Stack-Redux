import { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton';
import Spinner from '../components/shared/Spinner';
import { getTicket, reset, closeTicket } from '../features/ticket/ticketSlice';

function Ticket() {
  const { ticket, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.tickets
  );
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success('Ticket Closed');
    navigate('/tickets');
  };

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton url='/tickets' />
        <h2>
          Ticket ID : {ticket.ticket && ticket.ticket._id}
          <span
            className={`status status-${ticket.ticket && ticket.ticket.status}`}
          >
            {ticket.ticket && ticket.ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted :
          {new Date(ticket.ticket && ticket.ticket.createdAt).toLocaleString(
            'en-US'
          )}
        </h3>
        <h3>{ticket.ticket && ticket.ticket.product}</h3>
        <hr />
        <div className='ticket-desc'>
          <h3>Description of Issue</h3>
          <p>{ticket.ticket && ticket.ticket.description}</p>
        </div>
      </header>
      {ticket.status !== 'closed' && (
        <button onClick={onTicketClose} className='btn btn-block btn-danger'>
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
