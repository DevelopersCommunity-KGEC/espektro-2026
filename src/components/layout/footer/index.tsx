// import Espektrologo from '@/components-global/espektro-animated-logo/Espektrologo';
import Espektrologo from '../espektro-animated-logo/Espektrologo';
import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from 'react-icons/ai';
import './footer.css';
import styles from './style.module.scss';

const FooterSection = () => {
  return (
    <footer className={styles.footer_section}>
      <div className={styles.contact_container}>
        <div className={styles.contact}>
          <p>Souvik Konar</p>
          <p>Chairperson</p>
          <p>+91 7063653519</p>
        </div>

        <div className={styles.contact}>
          <p>Soumyadip Mondal</p>
          <p>Vice-Chairperson</p>
          <p>+91 7029511554</p>
        </div>
      </div>
      <div className={styles.espektrologo}>
        <div>
          <Espektrologo />
        </div>
      </div>

      <div className={styles.social_wrapper}>
        <h5 className={styles.sub__section__heading}>Follow us on</h5>
        <div className={styles.social_container}>
          <a
            href="https://www.instagram.com/espektro_kgec?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
          >
            <AiFillInstagram />
          </a>
          <a href="https://www.facebook.com/espektrokgec" target="_blank">
            <AiFillFacebook />
          </a>
          <a href="https://www.youtube.com/@EspektroKGEC" target="_blank">
            <AiFillYoutube />
          </a>
          {/* <a
            href="https://m.facebook.com/profile.php/?id=100064660150874&name=xhp_nt__fb__action__open_user"
            target="_blank"
          >
            <AiOutlineTwitter />
          </a> */}
        </div>
      </div>
      <div className={styles.address__wrapper}>
        <h5 className={styles.sub__section__heading}>Address</h5>
        <p>
          Fest Ground, Kalyani Government Engineering College, Kalyani, Nadia,
          West Bengal, India, Pin- 741235
        </p>
      </div>

      <div className={styles.kgecespektro}>
        <p>KGEC's</p>
        <p>Espektro</p>
      </div>

      <div className={styles.footer_bottom_container}>
        <div className={styles.copywrite}>&copy; Espektro KGEC</div>

        <div>
          <div>
            <a
              href="https://res.cloudinary.com/dezguraul/image/upload/v1741930364/espektro_sponsor_brochure_5_iubdru.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Event Brochure
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
