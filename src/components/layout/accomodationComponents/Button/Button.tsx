import React from 'react';
import style from './style.module.scss';

const Button: React.FC = () => {
  return (
    <div className="flex md:flex-row flex-col justify-center">
      {/* Techtix Section */}
      <section className={style.section}>
        <div className={style.container}>
          <h5 className={style.heading}>Techtix</h5>
          <p className={style.description}>
            Book your tickets now and secure your spot at the most exciting tech event of the year!
          </p>
          <a
  className={style.link}
  href="https://docs.google.com/forms/d/e/1FAIpQLSfXrxIVEPUyoonslEkfFUwzPHcPzAWHPc7rYTO5F5ot3QaYiQ/viewform?usp=header"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className={style.button}>Book Now</button>
</a>

        </div>
      </section>

      {/* Exotica Section */}
      <section className={style.section}>
        <div className={style.container}>
          <h5 className={style.heading}>Exotica</h5>
          <p className={style.description}>
            Join us for an exotic experience filled with creativity, art, and innovation!
          </p>
          <a
  className={style.link}
  href="https://forms.gle/FUbY5nk7iY9n2Xkn8"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className={style.button}>Book Now</button>
</a>

        </div>
      </section>
    </div>
  );
};

export default Button;

