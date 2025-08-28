import { Component, OnInit, AfterViewInit, ElementRef, HostListener, ViewChildren, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as AOS from 'aos';


interface ServiceFeature {
  id: string;
  title: string;
  description?: string;
  isStrikeThrough?: boolean;
  hasTooltip?: boolean;
  badge?: string;
}

// interface EldercarePackage {
//   id: string;
//   name: string;
//   price: number;
//   yearlyPrice: number;
//   backgroundColor: string;
//   modalId: string;
//   features: ServiceFeature[];
//   isStrikeThrough?: boolean;
// }

@Component({
  selector: 'app-eldercare',
  templateUrl: './eldercare.component.html',
  styleUrls: ['./eldercare.component.css']
})
export class EldercareComponent implements AfterViewInit {
  currentContentId: string | null = null;
  services: any[] = [];
  chunkedServices: any[][] = [];
  currentPackage: 'couple' | 'individual' = 'couple';
  payPerUseHeading: string | null = null;
  private lastScrollTop = 0; // store previous scroll position
  isCardScrolled: boolean = false;

// Get all price divs
@ViewChildren('priceDiv') priceDivs!: QueryList<ElementRef>;


  eldercarePackages: any[] = [
    {
      id: 'comfort-care',
      name: 'Comfort Care',
      couple_pckage:{
        original_price: 4750,
        price: 3800,
        yearlyPrice: 90000,
        modalId: 'myModal13',
      },
      individual_pckage:{
        original_price: 6250,
        price: 5000,
        yearlyPrice: 50000,
        modalId: 'myModal13',
      },
      backgroundColor: '#2d6d99',
      features: [
        {
          id: 'monthly-visits',
          title: 'Doctor Home Visits',
          badge:'Once in 3 months',
          description:
            'Regular monthly home visits by a MD General Physician for your comprehensive check-ups to ensure your health is monitored proactively.',
          hasTooltip: true,
          isStrikethrough:false

        },
        {
          id: 'health-focus',
          title: 'Focus on health',
          badge: 'Once a Month',
          description:
            'Embrace proactive wellness with our monthly / bimonthly vital monitoring service.',
          hasTooltip: true,
          isStrikethrough:false
        },
        {
          id: 'emergency-assistance',
          title: 'On-Demand emergency medical assistance',
          badge: 'Pay per Use',
          description:
            'Receive prompt medical aid from our emergency doctor-on-call service.',
          hasTooltip: true,
          isStrikethrough:false
        },
        {
          id: 'doctor-appointment',
          title: 'Arranging doctor/hospital appointment',
          description:
            'Facilitate appointments with new or your old doctors and hospitals based on your needs and preferences. Reducing waiting time.',
          hasTooltip: true,
          isStrikethrough:false
        },
        {
          id: 'medication-followup',
          title: 'Medication Follow-up and Reminders',
          description: '',
          isStrikethrough:true
        },
        {
          id: 'vision-care',
          title: 'Vision care services at door step',
          description:
            'Assistance in arranging vision tests at home or at vision care centres and eyewear prescriptions for optimal eye health.',
          hasTooltip: true
        },
        {
          id: 'diagnostic-test',
          title: 'Diagnostic test services at door step',
          description:
            'Facilitate appointments for diagnostic tests at home or in diagnostic centres to ensure timely and accurate assessments.',
          hasTooltip: true
        },
        {
          id: 'medicine-delivery',
          title: 'Medicine delivered at door step',
          description:
            'Facilitate the delivery of prescribed medications to your doorstep for convenience.',
          hasTooltip: true
        },
        {
          id: 'pre-hospitalization',
          title: 'Pre hospitalization assistance',
          description:
            'Assisting with non-clinical pain points during pre-hospitalization and preparation helps ensure readiness for surgery or treatment plans. This support streamlines the process, reduces anxiety, and improves overall outcomes by addressing all necessary preoperative requirements and logistical concerns.',
          hasTooltip: true
        },
        {
          id: 'post-hospitalization',
          title: 'Post hospitalization assistance',
          description:
            'Provides support for recovery and ongoing care after discharge, including follow-up appointments and home care services . Ensuring a smooth transition from hospital to home, promoting effective recovery and reducing the risk of complications.',
          hasTooltip: true
        },
        {
          id: 'health-records',
          title: 'Health records maintenance',
          description:
            'Maintain detailed health records from the date of subscription for easy access and reference.',
          hasTooltip: true
        },
        {
          id: 'real-time-updates',
          title: 'Real-time updates',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'insurance-management',
          title: 'Insurance management',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'intl-travel-insurance',
          title: 'International travel health insurance',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'accident-insurance-demise',
          title: 'Accident insurance domestic',
          badge: '3 Lacs In Case of Demise',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'accident-insurance-partial',
          title: 'Accident insurance domestic',
          badge: '25% of 3 lacs',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'travellers-immunizations',
          title: 'Travellers health immunizations',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'second-opinion',
          title: 'Taking second-opinion assistance',
          badge: 'Pay Per Use',
          description:
            'Access to one second opinion per problem if needed, ensuring informed decision-making regarding your healthcare.',
          hasTooltip: true
        },
        {
          id: 'diet-chart',
          title: 'Personalized diet chart plans',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'medication-assistance',
          title: 'Medication Assistance Hub and Beyond',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'pay-per-use-heading',
          title: 'Services listed below are pay-per-use',
          description: '',
          isSectionHeading: true
        },
        {
          id: 'ambulance-assistance',
          title: 'Ambulance Assistance',
          description:
            'Swift transport assistance via ambulance is provided when needed, ensuring timely access to medical care.Subjected to availability.',
          hasTooltip: true
        },
        {
          id: 'health-checkups',
          title: 'Health Check-ups Arrangement',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'bp-monitoring',
          title: '24 Hours BP Monitoring at home',
          description: ''
        },
        {
          id: 'ecg-monitoring',
          title: '24 Hours ECG monitoring at home',
          description: ''
        },
        {
          id: 'home-nursing',
          title: 'Home Nursing Services',
          description:
            'Round-the-clock bedside nursing care is available upon request and is subject to availability.',
          hasTooltip: true
        },
        {
          id: 'pain-management',
          title: 'Pain Management Assistance',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'cancer-care',
          title: 'Cancer Care',
          description:
            'Tailored support and care for individuals undergoing cancer treatment.',
          hasTooltip: true
        },
        {
          id: 'breast-cancer-screening',
          title: 'Breast Cancer screening at Home',
          description:
            'No radiation, no touch, no invasiveness, no pain, and in complete privacy.',
          hasTooltip: true
        },
        {
          id: 'stroke-care',
          title: 'Stroke and Paralytic Care',
          description:
            'Comprehensive assistance and care for stroke survivors and those with paralysis',
          hasTooltip: true
        },
        {
          id: 'xray',
          title: 'X Ray at your Doorstep',
          description:
            'Assist in arranging an X-ray from the comfort of your home.',
          hasTooltip: true
        },
        {
          id: 'ecg-doorstep',
          title: 'ECG at your Doorstep',
          description:
            'Offering the convenience of real-time heart monitoring without the need to visit a clinic. Manage your heart health from the comfort of their homes.',
          hasTooltip: true
        },
        {
          id: 'speech-hearing',
          title: 'Speech and Hearing Aid Arrangement',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'dental-care',
          title: 'Dental Care',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'rehabilitation',
          title: 'Rehabilitation Services',
          description:
            'Focus on restoring function, mobility, and quality of life after injury, surgery, or illness , ensuring a comprehensive recovery process, helping patients regain independence and achieve their optimal physical health.',
          hasTooltip: true
        },
        {
          id: 'functional-medicine',
          title: 'Functional Medicine',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'functional-nutrition',
          title: 'Functional Nutrition',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'nutrigenomix',
          title: 'Nutrigenomix Evaluation',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'physiotherapy',
          title: 'Supportive Physiotherapy Arrangement',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'old-age-home',
          title: 'Old Age Home Recommendations',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'psychological-care',
          title: 'Psychological and Psychiatric Care Arrangement',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'special-occasions',
          title: 'Special Occasion Celebrations',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'homeopathy',
          title: 'Homeopathy Care',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'ayurvedic-care',
          title: 'Ayurvedic Care',
          description: '',
          isStrikethrough: true
        },
        {
          id: 'de-addiction',
          title: 'De-Addiction Support',
          description: '',
          isStrikethrough: true
        }
      ]
    },
    {
      id: 'premium-care',
      name: 'Premium Care',
      couple_pckage:{
        original_price: 7000,
        price: 5600,
        yearlyPrice: 120000,
        modalId: 'myModal23',
      },
      individual_pckage:{
        original_price: 8333,
        price: 6666,
        yearlyPrice: 60000,
        modalId: '',
      },
      backgroundColor: '#e9663c',
      features: [
        {
          id: 'monthly-visits',
          title: 'Doctor Home Visits',
          badge:'Once in 2 months',
          description:
            'Regular monthly home visits by a MD General Physician for your comprehensive check-ups to ensure your health is monitored proactively.',
          hasTooltip: true,
          isStrikethrough:false

        },
        {
          id: 'health-focus',
          title: 'Focus on health',
          badge: 'Once a Month',
          description:
            'Embrace proactive wellness with our monthly / bimonthly vital monitoring service.',
          hasTooltip: true
        },
        {
          id: 'emergency-assistance',
          title: 'On-Demand emergency medical assistance',
          badge: '1 time',
          description:
            'Receive prompt medical aid from our emergency doctor-on-call service.',
          hasTooltip: true
        },
        {
          id: 'doctor-appointment',
          title: 'Arranging doctor/hospital appointment',
          description:
            'Facilitate appointments with new or your old doctors and hospitals based on your needs and preferences. Reducing waiting time.',
          hasTooltip: true,
          
        },
        {
          id: 'medication-followup',
          title: 'Medication Follow-up and Reminders',
          description: '',
          hasTooltip: false,
          isStrikethrough:true
        },
        {
          id: 'vision-care',
          title: 'Vision care services at door step',
          description:
            'Assistance in arranging vision tests at home or at vision care centres and eyewear prescriptions for optimal eye health.',
          hasTooltip: true
        },
        {
          id: 'diagnostic-test',
          title: 'Diagnostic test services at door step',
          description:
            'Facilitate appointments for diagnostic tests at home or in diagnostic centres to ensure timely and accurate assessments.',
          hasTooltip: true
        },
        {
          id: 'medicine-delivery',
          title: 'Medicine delivered at door step',
          description:
            'Facilitate the delivery of prescribed medications to your doorstep for convenience.',
          hasTooltip: true
        },
        {
          id: 'pre-hospitalization',
          title: 'Pre hospitalization assistance',
          description:
            'Assisting with non-clinical pain points during pre-hospitalization and preparation helps ensure readiness for surgery or treatment plans. This support streamlines the process, reduces anxiety, and improves overall outcomes by addressing all necessary preoperative requirements and logistical concerns.',
          hasTooltip: true
        },
        {
          id: 'post-hospitalization',
          title: 'Post hospitalization assistance',
          description:
            'Provides support for recovery and ongoing care after discharge, including follow-up appointments and home care services . Ensuring a smooth transition from hospital to home, promoting effective recovery and reducing the risk of complications.',
          hasTooltip: true
        },
        {
          id: 'health-records',
          title: 'Health records maintenance',
          description:
            'Maintain detailed health records from the date of subscription for easy access and reference.',
          hasTooltip: true
        },
        {
          id: 'real-time-updates',
          title: 'Real-time updates',
          description:
            'Receive timely tracking of appointments, test results, and health-related information.',
          hasTooltip: true
        },
        {
          id: 'insurance-management',
          title: 'Insurance management',
          description:
            'Assistance for any insurance-related queries or solutions during hospitalization, Reminders for insurance renewal and expert advice on selecting the best insurance package to suit your needs.',
          hasTooltip: true
        },
        {
          id: 'intl-travel-insurance',
          title: 'International travel health insurance',
          description:
            'Assistance for any international travel health insurance-related queries or solutions.',
          hasTooltip: true
        },
        {
          id: 'accident-insurance-demise',
          title: 'Accident insurance domestic',
          badge: '3 Lacs In Case of Demise',
          description:
            'Accident insurance coverage in case of the death / disability of a subscriber (PD/TD)',
          hasTooltip: true
        },
        {
          id: 'accident-insurance-partial',
          title: 'Accident insurance domestic',
          badge: '25% of 3 lacs',
          description:
            'Hospitalization: Accident insurance coverage hospitalization',
          hasTooltip: true
        },
        {
          id: 'travellers-immunizations',
          title: 'Travellers health immunizations',
          description:
            'Assistance in scheduling immunizations for international travel destinations.',
          hasTooltip: true
        },
        {
          id: 'second-opinion',
          title: 'Taking second-opinion assistance',
          badge: 'Twice a year',
          description:
            'Access to one second opinion per problem if needed, ensuring informed decision-making regarding your healthcare.',
          hasTooltip: true
        },
        {
          id: 'diet-chart',
          title: 'Personalized diet chart plans',
          badge: 'Pay Per Use',
          description:
            'Receive personalized diet charts tailored to your health goals and dietary preferences.',
          hasTooltip: true
        },
        {
          id: 'medication-assistance',
          title: 'Medication Assistance Hub and Beyond',
          description:
            'Access our help desk for scheduling doctor appointments, medication orders, lab tests, and more.',
          hasTooltip: true
        },
        {
          id: 'pay-per-use-heading',
          title: 'Services listed below are pay-per-use',
          description: '',
          hasTooltip: true
        },
        {
          id: 'ambulance-assistance',
          title: 'Ambulance Assistance',
          description:
            'Swift transport assistance via ambulance is provided when needed, ensuring timely access to medical care.Subjected to availability.',
          hasTooltip: true
        },
        {
          id: 'health-checkups',
          title: 'Health Check-ups Arrangement',
          description:
            'Facilitate the convenient scheduling of suitable annual health check-ups to detect any early signs of disease and monitor your well-being.',
          hasTooltip: true
        },
        {
          id: 'bp-monitoring',
          title: '24 Hours BP Monitoring at home',
          description: ''
        },
        {
          id: 'ecg-monitoring',
          title: '24 Hours ECG monitoring at home',
          description: ''
        },
        {
          id: 'home-nursing',
          title: 'Home Nursing Services',
          description:
            'Round-the-clock bedside nursing care is available upon request and is subject to availability.',
          hasTooltip: true
        },
        {
          id: 'pain-management',
          title: 'Pain Management Assistance',
          description:
            'Facilitation of pain management solutions to alleviate discomfort and improve the quality of life.',
          hasTooltip: true
        },
        {
          id: 'cancer-care',
          title: 'Cancer Care',
          description:
            'Tailored support and care for individuals undergoing cancer treatment.',
          hasTooltip: true
        },
        {
          id: 'breast-cancer-screening',
          title: 'Breast Cancer screening at Home',
          description:
            'No radiation, no touch, no invasiveness, no pain, and in complete privacy.',
          hasTooltip: true
        },
        {
          id: 'stroke-care',
          title: 'Stroke and Paralytic Care',
          description:
            'Comprehensive assistance and care for stroke survivors and those with paralysis',
          hasTooltip: true
        },
        {
          id: 'xray',
          title: 'X Ray at your Doorstep',
          description:
            'Assist in arranging an X-ray from the comfort of your home.',
          hasTooltip: true
        },
        {
          id: 'ecg-doorstep',
          title: 'ECG at your Doorstep',
          description:
            'Offering the convenience of real-time heart monitoring without the need to visit a clinic. Manage your heart health from the comfort of their homes.',
          hasTooltip: true
        },
        {
          id: 'speech-hearing',
          title: 'Speech and Hearing Aid Arrangement',
          description:
            'Assistance in procuring speech and hearing aids to enhance communication abilities',
          hasTooltip: true
        },
        {
          id: 'dental-care',
          title: 'Dental Care',
          description:
            'Facilitation of dental appointments and treatments for oral health maintenance.',
          hasTooltip: true
        },
        {
          id: 'rehabilitation',
          title: 'Rehabilitation Services',
          description:
            'Focus on restoring function, mobility, and quality of life after injury, surgery, or illness , ensuring a comprehensive recovery process, helping patients regain independence and achieve their optimal physical health.',
          hasTooltip: true
        },
        {
          id: 'functional-medicine',
          title: 'Functional Medicine',
          description:
            'Facilitation of a holistic approach to healthcare that aims to address the root cause of illness. Addressing the underlying causes of disease rather than just treating symptoms. In Functional medicine we offer comprehensive, personalized care that integrates lifestyle and environmental factors to promote long-term health and well-being.',
          hasTooltip: true
        },
        {
          id: 'functional-nutrition',
          title: 'Functional Nutrition',
          description:
            'Focuses on understanding the root causes of health issues by addressing the unique nutritional needs. Personalized dietary strategies that support optimal health, prevent chronic diseases, and enhance overall vitality.',
          hasTooltip: true
        },
        {
          id: 'nutrigenomix',
          title: 'Nutrigenomix Evaluation',
          description: '',
          hasTooltip: true,
          isStrikethrough: true
        },
        {
          id: 'physiotherapy',
          title: 'Supportive Physiotherapy Arrangement',
          description:
            'Assistance in providing specialized physiotherapy services to aid in rehabilitation and recovery.',
          hasTooltip: true
        },
        {
          id: 'old-age-home',
          title: 'Old Age Home Recommendations',
          description:
            'Guidance and recommendations for suitable old-age homes based on individual preferences.',
          hasTooltip: true
        },
        {
          id: 'psychological-care',
          title: 'Psychological and Psychiatric Care Arrangement',
          description:
            'Access to mental health professionals and support services.',
          hasTooltip: true
        },
        {
          id: 'special-occasions',
          title: 'Special Occasion Celebrations',
          description: '',
          hasTooltip: true
        },
        {
          id: 'homeopathy',
          title: 'Homeopathy Care',
          description:
            'Focusing on individualized treatment to stimulate the body\'s natural healing processes. Integrating a gentle, side-effect-free option that complements conventional treatments, enhancing overall well-being.',
          hasTooltip: true
        },
        {
          id: 'ayurvedic-care',
          title: 'Ayurvedic Care',
          description:
            'Emphasizes balancing the body, mind, and spirit through natural therapies tailored to individual needs. Providing time-tested, holistic treatments that promote long-term wellness and prevent illness by harmonizing bodily energies.',
          hasTooltip: true
        },
        {
          id: 'de-addiction',
          title: 'De-Addiction Support',
          description:
            'Assistance and resources are available for individuals seeking support in overcoming addiction challenges.',
          hasTooltip: true
        }
      ]
    },
    {
      id: 'golden-care',
      name: 'Golden Care',
      couple_pckage:{
        original_price: 8000,
        price: 6400,
        yearlyPrice: 120000,
        modalId: 'myModal64',
      },
      individual_pckage:{
        original_price: 10450,
        price: 8360,
        yearlyPrice: 80000,
        modalId: '',
      },
      backgroundColor: '#2d6d99',
      features: [
        {
          id: 'monthly-visits',
          title: 'Doctor Home Visits',
          badge:'Once in a month',
          description:
            'Regular monthly home visits by a MD General Physician for your comprehensive check-ups to ensure your health is monitored proactively.',
          hasTooltip: true,
          isStrikethrough:false

        },
        {
          id: 'health-focus',
          title: 'Focus on health',
          badge: 'Bi Monthly',
          description:
            'Embrace proactive wellness with our monthly / bimonthly vital monitoring service.',
          hasTooltip: true
        },
        {
          id: 'emergency-assistance',
          title: 'On-Demand emergency medical assistance',
          badge: '3 times',
          description:
            'Receive prompt medical aid from our emergency doctor-on-call service.',
          hasTooltip: true
        },
        {
          id: 'doctor-appointment',
          title: 'Arranging doctor/hospital appointment',
          description:
            'Facilitate appointments with new or your old doctors and hospitals based on your needs and preferences. Reducing waiting time.',
          hasTooltip: true,
          
        },
        {
          id: 'medication-followup',
          title: 'Medication Follow-up and Reminders',
          description: '',
          hasTooltip: false
        },
        {
          id: 'vision-care',
          title: 'Vision care services at door step',
          description:
            'Assistance in arranging vision tests at home or at vision care centres and eyewear prescriptions for optimal eye health.',
          hasTooltip: true
        },
        {
          id: 'diagnostic-test',
          title: 'Diagnostic test services at door step',
          description:
            'Facilitate appointments for diagnostic tests at home or in diagnostic centres to ensure timely and accurate assessments.',
          hasTooltip: true
        },
        {
          id: 'medicine-delivery',
          title: 'Medicine delivered at door step',
          description:
            'Facilitate the delivery of prescribed medications to your doorstep for convenience.',
          hasTooltip: true
        },
        {
          id: 'pre-hospitalization',
          title: 'Pre hospitalization assistance',
          description:
            'Assisting with non-clinical pain points during pre-hospitalization and preparation helps ensure readiness for surgery or treatment plans. This support streamlines the process, reduces anxiety, and improves overall outcomes by addressing all necessary preoperative requirements and logistical concerns.',
          hasTooltip: true
        },
        {
          id: 'post-hospitalization',
          title: 'Post hospitalization assistance',
          description:
            'Provides support for recovery and ongoing care after discharge, including follow-up appointments and home care services . Ensuring a smooth transition from hospital to home, promoting effective recovery and reducing the risk of complications.',
          hasTooltip: true
        },
        {
          id: 'health-records',
          title: 'Health records maintenance',
          description:
            'Maintain detailed health records from the date of subscription for easy access and reference.',
          hasTooltip: true
        },
        {
          id: 'real-time-updates',
          title: 'Real-time updates',
          description:
            'Receive timely tracking of appointments, test results, and health-related information.',
          hasTooltip: true
        },
        {
          id: 'insurance-management',
          title: 'Insurance management',
          description:
            'Assistance for any insurance-related queries or solutions during hospitalization, Reminders for insurance renewal and expert advice on selecting the best insurance package to suit your needs.',
          hasTooltip: true
        },
        {
          id: 'intl-travel-insurance',
          title: 'International travel health insurance',
          description:
            'Assistance for any international travel health insurance-related queries or solutions.',
          hasTooltip: true
        },
        {
          id: 'accident-insurance-demise',
          title: 'Accident insurance domestic',
          badge: '3 Lacs In Case of Demise',
          description:
            'Accident insurance coverage in case of the death / disability of a subscriber (PD/TD)',
          hasTooltip: true
        },
        {
          id: 'accident-insurance-partial',
          title: 'Accident insurance domestic',
          badge: '25% of 3 lacs',
          description:
            'Hospitalization: Accident insurance coverage hospitalization',
          hasTooltip: true
        },
        {
          id: 'travellers-immunizations',
          title: 'Travellers health immunizations',
          description:
            'Assistance in scheduling immunizations for international travel destinations.',
          hasTooltip: true
        },
        {
          id: 'second-opinion',
          title: 'Taking second-opinion assistance',
          badge: 'Twice a year',
          description:
            'Access to one second opinion per problem if needed, ensuring informed decision-making regarding your healthcare.',
          hasTooltip: true
        },
        {
          id: 'diet-chart',
          title: 'Personalized diet chart plans',
          badge: 'Pay Per Use',
          description:
            'Receive personalized diet charts tailored to your health goals and dietary preferences.',
          hasTooltip: true
        },
        {
          id: 'medication-assistance',
          title: 'Medication Assistance Hub and Beyond',
          description:
            'Access our help desk for scheduling doctor appointments, medication orders, lab tests, and more.',
          hasTooltip: true
        },
        {
          id: 'pay-per-use-heading',
          title: 'Services listed below are pay-per-use',
          description: '',
          hasTooltip: true
        },
        {
          id: 'ambulance-assistance',
          title: 'Ambulance Assistance',
          description:
            'Swift transport assistance via ambulance is provided when needed, ensuring timely access to medical care.Subjected to availability.',
          hasTooltip: true
        },
        {
          id: 'health-checkups',
          title: 'Health Check-ups Arrangement',
          description:
            'Facilitate the convenient scheduling of suitable annual health check-ups to detect any early signs of disease and monitor your well-being.',
          hasTooltip: true
        },
        {
          id: 'bp-monitoring',
          title: '24 Hours BP Monitoring at home',
          description: ''
        },
        {
          id: 'ecg-monitoring',
          title: '24 Hours ECG monitoring at home',
          description: ''
        },
        {
          id: 'home-nursing',
          title: 'Home Nursing Services',
          description:
            'Round-the-clock bedside nursing care is available upon request and is subject to availability.',
          hasTooltip: true
        },
        {
          id: 'pain-management',
          title: 'Pain Management Assistance',
          description:
            'Facilitation of pain management solutions to alleviate discomfort and improve the quality of life.',
          hasTooltip: true
        },
        {
          id: 'cancer-care',
          title: 'Cancer Care',
          description:
            'Tailored support and care for individuals undergoing cancer treatment.',
          hasTooltip: true
        },
        {
          id: 'breast-cancer-screening',
          title: 'Breast Cancer screening at Home',
          description:
            'No radiation, no touch, no invasiveness, no pain, and in complete privacy.',
          hasTooltip: true
        },
        {
          id: 'stroke-care',
          title: 'Stroke and Paralytic Care',
          description:
            'Comprehensive assistance and care for stroke survivors and those with paralysis',
          hasTooltip: true
        },
        {
          id: 'xray',
          title: 'X Ray at your Doorstep',
          description:
            'Assist in arranging an X-ray from the comfort of your home.',
          hasTooltip: true
        },
        {
          id: 'ecg-doorstep',
          title: 'ECG at your Doorstep',
          description:
            'Offering the convenience of real-time heart monitoring without the need to visit a clinic. Manage your heart health from the comfort of their homes.',
          hasTooltip: true
        },
        {
          id: 'speech-hearing',
          title: 'Speech and Hearing Aid Arrangement',
          description:
            'Assistance in procuring speech and hearing aids to enhance communication abilities',
          hasTooltip: true
        },
        {
          id: 'dental-care',
          title: 'Dental Care',
          description:
            'Facilitation of dental appointments and treatments for oral health maintenance.',
          hasTooltip: true
        },
        {
          id: 'rehabilitation',
          title: 'Rehabilitation Services',
          description:
            'Focus on restoring function, mobility, and quality of life after injury, surgery, or illness , ensuring a comprehensive recovery process, helping patients regain independence and achieve their optimal physical health.',
          hasTooltip: true
        },
        {
          id: 'functional-medicine',
          title: 'Functional Medicine',
          description:
            'Facilitation of a holistic approach to healthcare that aims to address the root cause of illness. Addressing the underlying causes of disease rather than just treating symptoms. In Functional medicine we offer comprehensive, personalized care that integrates lifestyle and environmental factors to promote long-term health and well-being.',
          hasTooltip: true
        },
        {
          id: 'functional-nutrition',
          title: 'Functional Nutrition',
          description:
            'Focuses on understanding the root causes of health issues by addressing the unique nutritional needs. Personalized dietary strategies that support optimal health, prevent chronic diseases, and enhance overall vitality.',
          hasTooltip: true
        },
        {
          id: 'nutrigenomix',
          title: 'Nutrigenomix Evaluation',
          description: '',
          hasTooltip: true
        },
        {
          id: 'physiotherapy',
          title: 'Supportive Physiotherapy Arrangement',
          description:
            'Assistance in providing specialized physiotherapy services to aid in rehabilitation and recovery.',
          hasTooltip: true
        },
        {
          id: 'old-age-home',
          title: 'Old Age Home Recommendations',
          description:
            'Guidance and recommendations for suitable old-age homes based on individual preferences.',
          hasTooltip: true
        },
        {
          id: 'psychological-care',
          title: 'Psychological and Psychiatric Care Arrangement',
          description:
            'Access to mental health professionals and support services.',
          hasTooltip: true
        },
        {
          id: 'special-occasions',
          title: 'Special Occasion Celebrations',
          description: '',
          hasTooltip: true
        },
        {
          id: 'homeopathy',
          title: 'Homeopathy Care',
          description:
            'Focusing on individualized treatment to stimulate the body\'s natural healing processes. Integrating a gentle, side-effect-free option that complements conventional treatments, enhancing overall well-being.',
          hasTooltip: true
        },
        {
          id: 'ayurvedic-care',
          title: 'Ayurvedic Care',
          description:
            'Emphasizes balancing the body, mind, and spirit through natural therapies tailored to individual needs. Providing time-tested, holistic treatments that promote long-term wellness and prevent illness by harmonizing bodily energies.',
          hasTooltip: true
        },
        {
          id: 'de-addiction',
          title: 'De-Addiction Support',
          description:
            'Assistance and resources are available for individuals seeking support in overcoming addiction challenges.',
          hasTooltip: true
        }
      ]
    }
  ];

  constructor(private http: HttpClient, private el: ElementRef) {}
  ngOnInit() {
    // Load JSON data
    this.http.get<any[]>('assets/json/eldercare-services.json').subscribe(data => {
      this.services = data;
      this.chunkedServices = this.chunkArray(this.services, 3); // group into 3 per slide
    });

    const firstPackage = this.eldercarePackages[0];
  const headingFeature = firstPackage.features.find((f:any) => f.id === 'pay-per-use-heading');
  this.payPerUseHeading = headingFeature ? headingFeature.title : null;
  }
  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000, // animation duration
      easing: 'ease-in-out',
      once: false,     // whether animation should happen only once
    });

    // Initialize scroll behavior after view is ready
    // setTimeout(() => {
    //   this.initializeScrollBehavior();
    // }, 100);
  }

  // private initializeScrollBehavior(): void {
  //   // Ensure price divs are properly initialized
  //   if (this.priceDivs && this.priceDivs.length > 0) {
  //     console.log('Price divs initialized:', this.priceDivs.length);
  //   }
  // }
  private chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
  showContent(id: string) {
    console.log('id',id);
    
    this.currentContentId = id;
  }

  hideContent(id: string) {
    this.currentContentId = null;
  }

  getContentId(packageId: string, featureId: string): string {
    console.log('check-id',packageId,featureId);
    
    return `content-${packageId}-${featureId}`;
  }
 
@HostListener('window:scroll', [])
onWindowScroll() {
  if (!this.priceDivs) return;

  this.priceDivs.forEach((priceDiv: ElementRef, index: number) => {
    const card = priceDiv.nativeElement.closest('.name-card');
    if (card) {
      const cardTop = card.getBoundingClientRect().top;

      if (cardTop <= 0) {
        card.classList.add('scrolled-to-top');
        if (index === 1) this.isCardScrolled = true;  // only for i==1
      } else {
        card.classList.remove('scrolled-to-top');
        if (index === 1) this.isCardScrolled = false;
      }
    }
  });
}

}
