import { AfterViewInit, Component } from '@angular/core';

interface ServiceCard {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  bgColor?: string;
  textColor?: string;
}

@Component({
  selector: 'app-medical-tourism',
  templateUrl: './medical-tourism.component.html',
  styleUrls: ['./medical-tourism.component.css']
})
export class MedicalTourismComponent implements AfterViewInit{
		
  cities: string[] = [
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Bangalore",
    "Pune"
  ];
  
  logos = [
    { alt: 'kims', src: 'assets/hospitals/kims.png' },
    { alt: 'yashodha', src: 'assets/hospitals/yh.png' },
    { alt: 'kamineni-hospitals', src: 'assets/hospitals/kh.png' },
    { alt: 'continental', src: 'assets/hospitals/ch.png' },
    { alt: 'virinchi-hospital', src: 'assets/hospitals/vh.png' },
    { alt: 'gemcare-logo', src: 'assets/hospitals/gh.png' },
    { alt: 'brinnova-logo-new', src: 'assets/hospitals/brinnova.png' },
    { alt: 'praaanaa', src: 'assets/hospitals/praanaa.png' },
    { alt: 'epione', src: 'assets/hospitals/epione.png' },
    { alt: 'Manipal', src: 'assets/hospitals/manipal.png' },
    { alt: 'Al Raheja', src: 'assets/hospitals/alraheja.png' },
    { alt: 'Kauvery', src: 'assets/hospitals/kauvery.jpeg' },
    { alt: 'Aster', src: 'assets/hospitals/aster.png' },
    { alt: 'Sri Ganga', src: 'assets/hospitals/sriganga.jpeg' },
    { alt: 'Gleneagles', src: 'assets/hospitals/gleneagles.png' },
    { alt: 'Fortis', src: 'assets/hospitals/fortis.jpeg' },
    { alt: 'Ramaiah', src: 'assets/hospitals/ramaiah.png' },
    { alt: 'Sakra', src: 'assets/hospitals/sakra.png' },
    { alt: 'SIMS', src: 'assets/hospitals/sims.png' },
    { alt: 'Moolchand', src: 'assets/hospitals/moolchand.webp' },
    { alt: 'AIIMS', src: 'assets/hospitals/Aiims.png' },
    { alt: 'VMMC', src: 'assets/hospitals/vmmc.png' },
    { alt: 'BLK MAX', src: 'assets/hospitals/BLKMAX.png' },
    { alt: 'Jaslok', src: 'assets/hospitals/jaslok.jpeg' },
    { alt: 'Artemis', src: 'assets/hospitals/artemis.png' },
    { alt: 'Ambani', src: 'assets/hospitals/ambani.png' },
    { alt: 'Apollo', src: 'assets/hospitals/apollo.jpg' },
    { alt: 'MGM', src: 'assets/hospitals/mgm.svg' }
  ];

  services: any[] = [
    {
      title: 'Cardiac Care',
      description: 'India is renowned for its state-of-the-art cardiac treatments. <strong>Soukhya.Health</strong> connects you with leading cardiac specialists and cutting-edge facilities for procedures such as angioplasty, bypass surgery, and heart transplants.',
      imageUrl: 'https://soukhya.health/assets/images/heart.png',
      link: 'https://soukhya.health/cardiac-surgery-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#ffffff',
      imgstyle:'cardiac_care',
      colsize:'col-6',
      img_width:'85%',
      text_color:'text-white',
      learn_more:'learn_more_btn_white'
    },
    {
      title: 'Orthopedic Surgery',
      description: 'Our orthopaedic experts provide comprehensive care for bone and joint conditions. From joint replacements to spine surgeries, we ensure you regain mobility and vitality.',
      imageUrl: 'https://soukhya.health/assets/images/orthopedic_image.jpg',
      link: 'https://soukhya.health/orthopedic-surgery-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      text_color:'text-black',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Cosmetic and Plastic Surgery',
      description: 'Enhance your natural beauty with <strong>Soukhya.Health</strong> cosmetic and plastic surgery services. Our skilled surgeons offer procedures like facelifts, liposuction, and breast augmentation with precision and care.',
      imageUrl: 'https://soukhya.health/assets/images/cos_image.jpg',
      link: 'https://soukhya.health/cosmetic-and-plastic-surgery-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
       text_color:'text-black',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Neurosurgery',
      description: 'Trust our skilled neurosurgeons to treat complex conditions of the brain and spine. Whether you require brain surgery, spinal fusion, or treatment for neurological disorders, we provide advanced care with precision.',
      imageUrl: 'https://soukhya.health/assets/images/body-organ.png',
      link: 'https://soukhya.health/neurosurgery-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#ffffff',
      colsize:'col-6',
      imgstyle:'cardiac_care',
       text_color:'text-white',
      learn_more:'learn_more_btn_white'
    },
    {
      title: 'Bariatric Surgery',
      description: 'Achieve long-term weight loss and improved health through bariatric surgery. <strong>Soukhya.Health</strong> connects you with top surgeons who perform procedures like gastric bypass and sleeve gastrectomy, helping you attain a healthier lifestyle.',
      imageUrl: 'https://soukhya.health/assets/images/bariatric_image.jpg',
      link: 'https://soukhya.health/bariatric-surgery-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-12',
      text_color:'text-black',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Gastrointestinal Procedures',
      description: 'Find relief from gastrointestinal issues with our range of procedures. From endoscopy to colorectal surgeries, our specialists address conditions like reflux, ulcers, and colorectal cancer.',
      imageUrl: 'https://soukhya.health/assets/images/gastro_image.jpg',
      link: 'https://soukhya.health/gastrointestinal-procedures-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      text_color:'text-black',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Ophthalmology',
      description: 'Restore and maintain your vision with our ophthalmic services.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/ophthalmology.png',
      link: 'https://soukhya.health/ophthalmology-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#ffffff',
      colsize:'col-6',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Rheumatology',
      description: 'If you suffer from autoimmune or musculoskeletal disorders like rheumatoid arthritis or lupus, our rheumatology specialists offer advanced treatments to alleviate pain and improve your quality of life.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/rheumatology.png',
      link: 'https://soukhya.health/rheumatology-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#ffffff',
      colsize:'col-6',
      imgstyle:'cardiac_care',
      img_width:'75%',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Pediatric Care',
      description: 'Your child\'s health is our priority. We provide specialized pediatric care for a wide range of conditions, from congenital heart defects to childhood cancers, delivered with utmost compassion.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/pediatric-care.png',
      link: 'https://soukhya.health/pediatric-care-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      imgstyle:'cardiac_care br_black',
      img_width:'85%',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'

    },
    {
      title: 'Organ Transplants',
      description: '<strong>Soukhya.Health</strong> facilitates life-saving organ transplants, including kidney, liver, and lung transplants. Our transplantation team ensures a seamless process from donor evaluation to post-surgery care.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/organ-transplants.jpg',
      link: 'https://soukhya.health/organ-transplants-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: 'Fertility Treatments',
      description: 'India is a hub for advanced fertility treatments. We offer a range of services.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/fertility-treatments.png',
      link: 'https://soukhya.health/fertility-treatments-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#ffffff',
      colsize:'col-6',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Rehabilitation Services',
      description: 'Comprehensive post-surgery and injury rehabilitation programmes are available to help you recover and regain independence. Physical therapy, occupational therapy, and speech therapy are part of our offerings.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/rehabilitation-services.png',
      link: 'https://soukhya.health/rehabilitation-services-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#ffffff',
      colsize:'col-6',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Dermatology and Aesthetics',
      description: 'Our dermatologists provide solutions for skin, hair, and nail conditions. Additionally, we offer a range of aesthetic treatments, from laser therapy to non-surgical facial rejuvenation.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/dermatology-and-aesthetics.png',
      link: 'https://soukhya.health/dermatology-and-aesthetics-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      imgstyle:'cardiac_care br_black',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: 'Transgender Healthcare',
      description: '<strong>Soukhya.Health</strong> is proud to offer comprehensive transgender healthcare services, including gender-affirming surgeries, hormone therapy, and mental health support. We are committed to providing safe and affirming care for all individuals.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/transgender-healthcare.jpg',
      link: 'https://soukhya.health/transgender-healthcare-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Pulmonology',
      description: 'For respiratory conditions like asthma, COPD, or sleep apnea, our pulmonologists offer comprehensive diagnostics and treatments to help you breathe easier and improve your lung health.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/pulmonology.png',
      link: 'https://soukhya.health/pulmonology-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#ffffff',
      colsize:'col-6',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Plastic and Reconstructive Surgery',
      description: 'Beyond cosmetic procedures, our skilled plastic surgeons can help with reconstructive surgery after accidents, injuries, or cancer treatments, restoring both form and function.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/plastic-and-reconstructive-surgery.png',
      link: 'https://soukhya.health/plastic-and-reconstructive-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#ffffff',
      colsize:'col-6',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'ENT (Ear, Nose, and Throat) Care',
      description: 'Whether you need sinus surgery, hearing aids, or treatment for throat conditions, our ENT specialists deliver expert care for all your ear, nose, and throat needs.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/ent.png',
      link: 'https://soukhya.health/ent-care-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      imgstyle:'cardiac_care br_black',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: 'Pain Management',
      description: 'Chronic pain can be debilitating. Our pain management specialists offer a range of therapies, from physical rehabilitation to interventional procedures, to provide relief and improve your quality of life.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/pain-management.jpg',
      link: 'https://soukhya.health/pain-management-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Geriatric Care',
      description: 'Seniors can access specialised healthcare services, including geriatric assessments, home healthcare, and elder care coordination, ensuring a comfortable and dignified ageing process.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/geriatric-care.jpg',
      link: 'https://soukhya.health/geriatric-care-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
      learn_more:'learn_more_btn_black'
    },
    {
      title: 'Allied Healthcare',
      description: 'Our team includes various allied healthcare professionals, such as physiotherapists, dietitians, and respiratory therapists, ensuring holistic care to support your recovery.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/allied-healthcare.png',
      link: 'https://soukhya.health/allied-healthcare-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#ffffff',
      colsize:'col-6',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Mental health and wellness',
      description: 'Mental health is an integral part of overall well-being. Our network includes psychiatrists, psychologists, and counsellors who offer therapy and support for various mental health concerns.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/mental-health-and-wellness.jpg',
      link: 'https://soukhya.health/mental-health-and-wellness-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
     learn_more:'learn_more_btn_black'

    },
    {
      title: 'Diabetes Management',
      description: 'Access comprehensive diabetes care, including diabetes education, medications, insulin management, and lifestyle support, to effectively manage and control your condition.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/diabetes-management.jpg',
      link: 'https://soukhya.health/diabetes-management-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      colsize:'col-6',
       learn_more:'learn_more_btn_black'
    },
   
    {
      title: 'Urology Services',
      description: 'Our urologists treat a wide range of conditions, from kidney stones to prostate issues, providing both surgical and non-surgical solutions for optimal urological health.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/urology-services.png',
      link: 'https://soukhya.health/urology-services-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#ffffff',
      colsize:'col-6',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Neonatal Care',
      description: 'For expectant parents seeking the best in neonatal care,<strong>Soukhya.health</strong> provides top-tier services that include specialised preterm care, intricate neonatal surgeries, and comprehensive support for premature infants.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/neonatal-care.png',
      link: 'https://soukhya.health/neonatal-care-india-medical-tourism',
      bgColor: '#ffffff',
      textColor: '#000000',
      img_width:'75%',
      colsize:'col-6',
      imgstyle:'cardiac_care br_black',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: 'Robotic Surgery Center',
      description: 'Experience the precision and minimal invasiveness of robotic-assisted surgery. Our specialised robotic surgery centre offers cutting-edge procedures for various medical conditions.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/robotic-surgery-center.png',
      link: 'https://soukhya.health/robotic-surgery-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#fff',
      colsize:'col-12',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: 'Genomic Medicine',
      description: 'Discover personalised healthcare through genomic medicine. Our experts use genetic information to tailor treatments and preventive strategies to your unique genetic profile.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/genomic-medicine.jpg',
      link: 'https://soukhya.health/genomic-medicine-india-medical-tourism',
      bgColor: '#fff',
      textColor: '#000',
      colsize:'col-12',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: 'Stem Cell Therapy',
      description: 'Explore the potential of regenerative medicine with our stem cell therapy department. We provide innovative treatments to promote healing and tissue regeneration.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/stem-cell-therapy.jpg',
      link: 'https://soukhya.health/stem-cell-therapy-india-medical-tourism',
      bgColor: '#fff',
      textColor: '#fff',
      colsize:'col-6',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: 'Telemedicine Services',
      description: 'Access healthcare from anywhere with our telemedicine department. Consult with our specialists remotely for medical advice, follow-ups, and second opinions.',
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/telemedicine-services.png',
      link: 'https://soukhya.health/stem-cell-therapy-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#fff',
      img_width:'75%',
      imgstyle:'cardiac_care',
      colsize:'col-6',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: "Traveller's Health Clinic",
      description: "Ensure a healthy journey with our traveller's health clinic. Get vaccinations, travel advice, and health assessments before embarking on your medical tourism trip.",
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/traveler-health-clinic.jpg',
      link: 'https://soukhya.health/stem-cell-therapy-india-medical-tourism',
      bgColor: '#fff',
      textColor: '#000',
      colsize:'col-12',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: "Palliative Care",
      description: "For patients facing serious illnesses, our palliative care team provides compassionate support, symptom management, and quality of life enhancement.",
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/palliative-care.jpg',
      link: 'https://soukhya.health/stem-cell-therapy-india-medical-tourism',
      bgColor: '#fff',
      textColor: '#000',
      colsize:'col-6',
      text_color:'text-black',
     learn_more:'learn_more_btn_black'
    },
    {
      title: "Aesthetic Dentistry",
      description: "Achieve your dream smile with our aesthetic dentistry department. From teeth whitening to smile makeovers, we offer advanced dental cosmetic solutions.",
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/aesthetic-dentistry.png',
      link: 'https://soukhya.health/stem-cell-therapy-india-medical-tourism',
      bgColor: '#e8444d',
      textColor: '#fff',
      colsize:'col-6',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    },
    {
      title: "Emergency Medical Assistance",
      description: "Rest assured with 24/7 emergency medical assistance. We provide rapid response and coordination in the event of unexpected healthcare needs during your stay.",
      imageUrl: 'https://soukhya.health/assets/images/mt-sr/emergency-medical-assistance.png',
      link: 'https://soukhya.health/stem-cell-therapy-india-medical-tourism',
      bgColor: '#2b92cc',
      textColor: '#fff',
      colsize:'col-6',
      img_width:'75%',
      imgstyle:'cardiac_care',
      text_color:'text-white',
     learn_more:'learn_more_btn_white'
    }
  ];
 

  
  ngAfterViewInit(): void {
    this.setupMarquee('[data-dup]');
    this.setupFAQ();
    this.populateCountryCodes();
    this.setupMultiSelectHint();
    this.setupScrollButtons();
    this.setupShare();
    this.setupGeolocation();
    this.setupForm();
  }

  get loopedLogos(){
    return [...this.logos , ...this.logos]
  }
  private setupMarquee(selector: string): void {
    const tracks = Array.from(document.querySelectorAll<HTMLElement>(selector));
    for (const track of tracks) {
      const content = track.innerHTML.trim();
      track.innerHTML = content + content;
    }
  }

  private setupFAQ(): void {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.faq-item'));
    items.forEach(item => {
      const btn = item.querySelector<HTMLButtonElement>('.faq-q');
      const ans = item.querySelector<HTMLElement>('.faq-a');
      if (!btn || !ans) return;
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if (expanded) ans.setAttribute('hidden', '');
        else ans.removeAttribute('hidden');
      });
    });
  }

  private populateCountryCodes(): void {
    const select = document.getElementById('countryCode') as HTMLSelectElement | null;
    if (!select) return;
    const codes: Array<[string, string]> = [
      ['+91', 'India'], ['+1', 'USA/Canada'], ['+971', 'UAE'], ['+44', 'UK'],
      ['+61', 'Australia'], ['+65', 'Singapore'], ['+966', 'Saudi'], ['+974', 'Qatar'],
      ['+81', 'Japan'], ['+49', 'Germany'], ['+33', 'France'], ['+39', 'Italy']
    ];
    select.innerHTML = codes.map(([code, name]) => `<option value="${code}">${code} (${name})</option>`).join('');
    select.value = '+91';
  }

  private setupMultiSelectHint(): void {
    const select = document.getElementById('services') as HTMLSelectElement | null;
    const hint = document.getElementById('servicesHint') as HTMLElement | null;
    if (!select || !hint) return;
    const update = () => {
      const selected = Array.from(select.selectedOptions)
        .map(o => o.textContent?.trim() || '')
        .filter(Boolean);
      hint.textContent = selected.length ? `${selected.length} selected` : 'No options selected.';
    };
    select.addEventListener('change', update);
    update();
  }

  private setupScrollButtons(): void {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-scroll-to]'));
    for (const btn of buttons) {
      const targetSel = btn.getAttribute('data-scroll-to');
      if (!targetSel) continue;
      btn.addEventListener('click', () => {
        const target = document.querySelector<HTMLElement>(targetSel);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  private setupShare(): void {
    const btn = document.querySelector<HTMLButtonElement>('[data-share]');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const shareData = {
        title: 'Soukhya.Health — Medical Tourism',
        text: 'Explore advanced medical treatments in India with personalised care.',
        url: window.location.href
      };
      try {
        if ((navigator as any).share) {
          await (navigator as any).share(shareData);
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareData.url);
          alert('Link copied to clipboard.');
        } else {
          alert(shareData.url);
        }
      } catch {
        // ignore
      }
    });
  }

  private setupGeolocation(): void {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {},
      { enableHighAccuracy: false, timeout: 3000, maximumAge: 60000 }
    );
  }

  private setupForm(): void {
    const form = document.getElementById('enquiryForm') as HTMLFormElement | null;
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const fullName = (formData.get('fullName') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();

      if (!fullName || !email || !phone) {
        alert('Please complete the required fields.');
        return;
      }
      alert('Thank you! Your enquiry has been submitted.');
      form.reset();
      this.populateCountryCodes();
      this.setupMultiSelectHint();
    });
  }
}
