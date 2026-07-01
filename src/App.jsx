import { useState } from 'react';
import BrandHeader from './components/BrandHeader';
import FeedbackForm from './components/FeedbackForm';
import SuccessView from './components/SuccessView';

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="wrap">
      <BrandHeader />
      {submitted ? (
        <SuccessView />
      ) : (
        <FeedbackForm onSuccess={() => setSubmitted(true)} />
      )}
    </div>
  );
}
