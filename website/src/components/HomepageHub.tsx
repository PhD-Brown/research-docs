import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faBook, faVial, faUsers } from '@fortawesome/free-solid-svg-icons';

const cardData = [
  {
    title: "Getting Started",
    icon: faRocket,
    description: "Follow a complete tutorial to install the project and run your first classification in under 10 minutes.",
    link: "/AstroSpectro/docs/getting-started",
    buttonText: "Start the Tutorial"
  },
  {
    title: "User Guides",
    icon: faBook,
    description: "Detailed tutorials for each key step: downloading, processing, training, and visualisation.",
    link: "/AstroSpectro/docs/user-guides",
    buttonText: "Browse the Guides"
  },
  {
    title: "Scientific Context",
    icon: faVial,
    description: "Dive into the astrophysical context: LAMOST catalogue, spectral types, and methodology.",
    link: "/AstroSpectro/docs/science",
    buttonText: "Explore the Context"
  },
  {
    title: "Community & Contributing",
    icon: faUsers,
    description: "Want to contribute, cite the project, or ask a question? All resources are here.",
    link: "/AstroSpectro/docs/community",
    buttonText: "Join the Community"
  }
];

const HubCard = ({ title, icon, description, link, buttonText }) => (
  <div className="col col--6 margin-bottom--lg">
    <div className="card hub-card">
      <div className="card__header">
        <h3><FontAwesomeIcon icon={icon} /> {title}</h3>
      </div>
      <div className="card__body">
        <p>{description}</p>
      </div>
      <div className="card__footer">
        <a href={link} className="button button--secondary button--block">
          {buttonText}
        </a>
      </div>
    </div>
  </div>
);

export default function HomepageHub() {
  return (
    <div className="container">
      <div className="row justify-content--center">
        {cardData.map((card, idx) => (
          <HubCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}
