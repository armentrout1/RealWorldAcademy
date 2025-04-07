import React from 'react';
import { BuddyJournal } from '@/components/ai';
import { Helmet } from 'react-helmet';

const Journal: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Your Journal | Real World Academy</title>
      </Helmet>
      <BuddyJournal />
    </div>
  );
};

export default Journal;