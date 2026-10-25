
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Sparkles,
} from 'lucide-react';

import { SectionHeading } from '../components/Layout';
import {
  ServicesSection,
  CTASection,
  ValuesStrip,
} from '../components/Shared';
import homeChild from '../images/home-child.jpg';
import armaan from '../images/armaan.JPG';
import sense from '../images/sense.jpg';
import playImage from '../images/child.JPG';
import movementImage from '../images/inclusive-classroom-collaboration.jpeg';
import drawingImage from '../images/OIP.webp';

const activities = [
  { title: 'Sensory discovery', text: 'Gentle, guided opportunities to explore textures, sounds and movement.', image: sense, tag: 'Sensory play' },
  { title: 'Movement & coordination', text: 'Supported movement activities that encourage balance and body awareness.', image: movementImage, tag: 'Motor skills' },
  { title: 'Creative expression', text: 'Art and hands-on projects that support choice and fine-motor practice.', image: drawingImage, tag: 'Creative time' },
  { title: 'Play & connection', text: 'Positive, supported play at every child’s pace.', image: playImage, tag: 'Social connection' },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              A kinder way to grow
            </span>

            <h1>
              Little steps.
              <br />
              <em>Big possibilities.</em>
            </h1>

            <p className="hero-lead">
              Specialised care and developmental support for children
              with disabilities and additional needs — with families
              beside us at every step.
            </p>

            <div className="hero-actions">
              <Link to="/appointment" className="button">
                Let’s talk about your child
                <ArrowUpRight size={17} />
              </Link>

              <Link
                to="/services"
                className="text-link text-link-large"
              >
                Explore our care
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hero-trust">
              <div className="avatar-stack">
                <span>♡</span>
                <span>✳</span>
                <span>☼</span>
              </div>

              <div>
                <strong>Every child belongs here.</strong>
                <small>Care that starts with listening.</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <img
                src={armaan}
                alt="A warm, supportive environment for children and families"
              />

              <div className="image-label">
                <span className="label-icon">
                  <Heart size={16} fill="currentColor" />
                </span>

                <span>
                  <strong>Care without comparison</strong>
                  <small>Every journey is unique</small>
                </span>
              </div>
            </div>

            <div className="hero-sticker sticker-top">
              <Sparkles size={17} />
              <span>Small steps count</span>
            </div>

            <div className="hero-sticker sticker-bottom">
              <span className="sticker-sun">☀</span>
              <span>Grow at your own pace</span>
            </div>

            <div className="hero-blob" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <ValuesStrip />

      {/* Introduction Section */}
      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="intro-photo-wrap">
            <img
              src={homeChild}
              alt="Family sharing a caring moment"
            />

            <div className="intro-note">
              <span className="note-mark">✳</span>

              <span>
                <strong>Care is a partnership.</strong>
                <small>With children. With families.</small>
              </span>
            </div>
          </div>

          <div className="intro-copy">
            <SectionHeading
              eyebrow="Welcome to BrightSteps"
              title="A place to feel understood."
              text="Every child communicates, learns and experiences the world in their own way. BrightSteps brings together therapy, rehabilitation and personalised developmental support in one welcoming place."
            />

            <p>
              We focus on each child’s strengths, comfort and individual
              goals — while helping parents feel informed, included and
              supported.
            </p>

            <Link to="/about" className="text-link">
              Get to know BrightSteps
              <ArrowRight size={16} />
            </Link>

            <div className="mini-stats">
              <div>
                <strong>01</strong>
                <span>
                  Child-first
                  <br />
                  approach
                </span>
              </div>

              <div>
                <strong>♡</strong>
                <span>
                  Family-centred
                  <br />
                  partnership
                </span>
              </div>

              <div>
                <strong>∞</strong>
                <span>
                  Room to grow
                  <br />
                  in your own way
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection limit={3} />

      {/* Activities Preview Section */}
      <section className="section activity-preview">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Everyday discovery"
              title="Growth happens in many ways"
              text="Meaningful activities help children explore, practise new skills and connect in ways that feel right for them."
            />

            <Link
              to="/activities"
              className="text-link desktop-link"
            >
              See our activities
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="activity-grid">
            {activities.slice(0, 3).map((a, i) => (
              <Link
                to="/activities"
                className={`activity-card activity-${i + 1}`}
                key={a.title}
              >
                <div className="activity-image">
                  <img src={a.image} alt={a.title} />
                  <span className="activity-tag">{a.tag}</span>
                </div>

                <div className="activity-info">
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </div>

                  <span className="circle-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/activities"
            className="button button-outline mobile-center-link"
          >
            Explore supported activities
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Parallax Feature Section */}
      <section
        className="parallax-feature"
        aria-label="Every child can grow"
      >
        <div
          className="parallax-backdrop"
          role="img"
          aria-label="Children enjoying a supported outdoor activity"
        />

        <div className="parallax-overlay" />

        <div className="container parallax-content">
          <span className="parallax-kicker">
            <Sparkles size={15} />
            A little room to bloom
          </span>

          <h2>
            Different ways to shine.
            <br />
            <em>One place to belong.</em>
          </h2>

          <p>
            Gentle support, joyful discovery and progress that honours
            every child’s pace.
          </p>

          <Link
            to="/activities"
            className="button button-light"
          >
            Discover our activities
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="parallax-floating-card parallax-card-one">
          <span>✳</span>

          <div>
            <strong>Small wins matter</strong>
            <small>Every step is worth celebrating</small>
          </div>
        </div>

        <div className="parallax-floating-card parallax-card-two">
          <span>♡</span>

          <div>
            <strong>Care that feels safe</strong>
            <small>Built around your child</small>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="section approach-section">
        <div className="container approach-grid">
          <div className="approach-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Our approach
            </span>

            <h2>
              Progress isn’t a race.
              <br />
              <em>It’s personal.</em>
            </h2>

            <p>
              We build support around the child in front of us — their
              interests, sensory needs, communication style and family
              priorities. Goals are practical, thoughtful and revisited
              together.
            </p>

            <Link
              to="/about"
              className="button button-outline"
            >
              Our care philosophy
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="approach-steps">
            <div className="approach-step">
              <span>01</span>

              <div>
                <h3>We listen first</h3>
                <p>
                  We make time for your concerns, observations and hopes
                  for your child.
                </p>
              </div>
            </div>

            <div className="approach-step">
              <span>02</span>

              <div>
                <h3>We plan together</h3>
                <p>
                  We agree on meaningful goals and support that fits
                  your child’s needs.
                </p>
              </div>
            </div>

            <div className="approach-step">
              <span>03</span>

              <div>
                <h3>We celebrate progress</h3>
                <p>
                  We recognise the small wins and adapt when your child
                  needs something different.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <CTASection />
    </>
  );
}
