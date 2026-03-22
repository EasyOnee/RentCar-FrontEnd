import { Component, AfterViewInit, EventEmitter, Output, HostListener } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports:[NgbDropdownModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  version: string | undefined;
  currentTime: string | undefined;

  public showSearch = false;

  constructor(
    public auth: AuthService,
    private versionService: VersionService
  ) {}

  ngOnInit(): void {
    this.versionService.getVersion().subscribe((data: { version: string | undefined; }) => {
      this.version = data.version;
    });

    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    const strTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)} ${ampm}`;
    this.currentTime = strTime;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  toggleDropdown() {
    const dropdownContent = document.getElementById("myDropdown");
    if (dropdownContent) {
      dropdownContent.classList.toggle("show");
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i] as HTMLElement;
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-warning',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/user1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/user2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/user4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'Español',
    code: 'es',
    icon: 'es'
  },
  {
    language: 'Français',
    code: 'fr',
    icon: 'fr'
  },
  {
    language: 'German',
    code: 'de',
    icon: 'de'
  }]

  ngAfterViewInit() { }
  
}
