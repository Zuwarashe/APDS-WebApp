// src/components/ui/card.js
import React from 'react';

export const Card = ({ children }) => (
  <div className="card border rounded shadow p-4">{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="card-header font-bold text-lg mb-2">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="card-title text-xl font-semibold">{children}</h2>
);

export const CardContent = ({ children }) => (
  <div className="card-content text-gray-700">{children}</div>
);
