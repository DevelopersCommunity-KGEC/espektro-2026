"use client"

import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from 'react-icons/ai';
import './footer.css';
import styles from './style.module.scss';
import Image from 'next/image';

const FooterSection = () => {
  return (
    <footer className={styles.footer_section}>
      {/* Decorative top border */}
      <div className={styles.top_border}>
        <div className={styles.border_dots_left}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.border_line}></div>
        <div className={styles.border_dots_right}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={styles.footer_content}>
        {/* Left: Logo */}
        <div className={styles.logo_section}>
          <div className={styles.logo_circle}>
            <Image
              src="/logo3.png"
              alt="Espektro Logo"
              width={100}
              height={100}
              className={styles.logo_image}
            />
          </div>
        </div>

        {/* Center: Contacts and Social */}
        <div className={styles.center_section}>
          <div className={styles.contacts_row}>
            <div className={styles.contact_person}>
              <h3>Souvik Konar</h3>
              <p>Chairperson</p>
              <p>+91 7063653519</p>
            </div>

            <div className={styles.decorative_dots}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={styles.contact_person}>
              <h3>Soumyadip Mondal</h3>
              <p>Vice-Chairperson</p>
              <p>+91 7028511554</p>
            </div>
          </div>

          <div className={styles.social_section}>
            <div className={styles.social_divider_left}></div>
            <h5>Follow us on</h5>
            <div className={styles.social_divider_right}></div>
          </div>

          <div className={styles.social_icons}>
            <a
              href="https://www.instagram.com/espektro_kgec?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillInstagram />
            </a>
            <a href="https://www.facebook.com/espektrokgec" target="_blank" rel="noopener noreferrer">
              <AiFillFacebook />
            </a>
            <a href="https://www.youtube.com/@EspektroKGEC" target="_blank" rel="noopener noreferrer">
              <AiFillYoutube />
            </a>
          </div>
        </div>

        {/* Right: Address and Branding */}
        <div className={styles.right_section}>
          <div className={styles.address_block}>
            <h5>Address</h5>
            <div className={styles.address_underline}></div>
            <p>
              Fest Ground, Kalyani Government Engineering<br />
              College, Kalyani, Nadia, West Bengal, India,<br />
              Pin—741235
            </p>
          </div>

          <div className={styles.branding}>
            <p className={styles.branding_top}>KGEC's</p>
            <p className={styles.branding_main}>Espektro</p>
            <div className={styles.branding_dots}>
              <span></span>
              <span></span>
            </div>
            <div className={styles.branding_underline}></div>
            <div className={styles.branding_dots}>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
