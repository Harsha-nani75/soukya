import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-medical-tourism',
  templateUrl: './medical-tourism.component.html',
  styleUrls: ['./medical-tourism.component.css']
})
export class MedicalTourismComponent implements AfterViewInit{
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
