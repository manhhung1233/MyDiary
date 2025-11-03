import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="pt-[120px] pb-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold text-dark dark:text-white">
            404 - Page Not Found
          </h1>
          <p className="mb-8 text-base text-body-color dark:text-dark-6">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center py-3 text-base font-medium text-center text-[#1E40AF] border rounded-md border-primary bg-primary px-7 hover:border-blue-dark hover:bg-blue-dark"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

