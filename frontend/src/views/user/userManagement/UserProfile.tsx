import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface User {
  username: string;
  firstname: string;
  lastname: string;
  address: string;
  mobilenumber: string;
  email: string;
}

interface Order {
  _id: string;
  items: string[];
  totalAmount: number;
  status: string;
}

interface Feedback {
  _id: string;
  comment: string;
  date: string;
  reply: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profilep-get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(profileResponse.data);
      } catch (err: any) {
        setError(err.response?.data.message || 'Failed to fetch user profile');
      }
    };

    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const ordersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/orders/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(ordersResponse.data || []);
      } catch (err: any) {
        console.error(err.response?.data.message || 'Failed to fetch user orders');
        setOrders([]);
      } 
    };

    const fetchUserFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const feedbackResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(feedbackResponse.data || []);
      } catch (err: any) {
        console.error(err.response?.data.message || 'Failed to fetch user feedback');
        setFeedbacks([]);
      }
    };

    fetchUserProfile();
    fetchUserOrders();
    fetchUserFeedback();

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteFeedback = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this feedback?");
    
    if (!isConfirmed) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/feedback/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback._id !== id));
    } catch (err: any) {
      console.error(err.response?.data.message || 'Failed to delete feedback');
    }
  };
  

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className=''>
      <main className="flex-1 md:px-20 px-4 sm:px-8 lg:pt-4 lg:px-56 flex flex-col mx-auto mb-10">
        <section className="bg-gray-100 shadow rounded-2xl shadow-lg mt-10">
          <div className="md:flex border-b dark:border-gray-300">
            <h2 className="text-10 text-gray-500 font-semibold bg-grey-light text-left w-full py-4 pl-10 rounded-t-2xl">
              User Profile Details
            </h2>
          </div>
          <form className='p-10'>
            <div className="md:flex mb-8">
              <div className="md:w-1/3">
                <legend className="text-base font-bold tracking-tight text-gray-900 dark:text-grey">Account Details</legend>
              </div>
              {user && (
                <div className="md:flex-1 mb:mt-0 md:px-3">
                  <div className="md:flex mb-4">
                    <div className="md:flex-1 md:pr-3 mb-3">
                      <label className="text-base font-semibold tracking-tight text-gray-900 dark:text-grey">First Name</label>
                      <input className="w-full rounded-lg p-2 border-0" type="text" readOnly placeholder={user.firstname} />
                    </div>
                    <div className="md:flex-1 md:pl-3 mb-3">
                      <label className="text-base font-semibold tracking-tight text-gray-900 dark:text-grey">Last Name</label>
                      <input className="w-full rounded-lg p-2 border-0" type="text" readOnly placeholder={user.lastname} />
                    </div>
                  </div>
                  <div className="md:flex mb-4">
                    <div className="md:flex-1 md:pr-3 mb-3">
                      <label className="text-base font-semibold tracking-tight text-gray-900 dark:text-grey">Email Address</label>
                      <input className="w-full rounded-lg p-2 border-0" type="text" readOnly placeholder={user.email} />
                    </div>
                    <div className="md:flex-1 md:pl-3 mb-3">
                      <label className="text-base font-semibold tracking-tight text-gray-900 dark:text-grey">Password</label>
                      <input className="w-full rounded-lg p-2 border-0" type="password" readOnly placeholder="********" />
                    </div>
                  </div>
                  <div className="md:flex-1 mb-10">
                    <label className="text-base font-semibold tracking-tight text-gray-900 dark:text-grey">Delivery Address</label>
                    <input className="w-full rounded-lg p-2 border-0" type="text" readOnly placeholder={user.address} />
                  </div>
                  <Link to="/user-profile/update" className="mx-2">
                    <button
                      type="button"
                      className="px-5 py-2 bg-primary text-20 text-white font-semibold rounded-lg border border-primary transition duration-1000 ease-in-out hover:text-white hover:bg-grey -ml-2">
                      Edit Details
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Orders Section */}
        <section className="my-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
          {orders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold">Items:</h4>
                    <ul className="list-disc list-inside">
                      {order.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You have no orders.</p>
          )}
        </section>

        <section className="my-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Feedback</h2>
          {feedbacks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="bg-white p-6 rounded-lg shadow-md">
                  <p>{feedback.comment}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(feedback.date).toLocaleDateString()}</p>
                  <p>{feedback.reply}</p>
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You have no feedback.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
