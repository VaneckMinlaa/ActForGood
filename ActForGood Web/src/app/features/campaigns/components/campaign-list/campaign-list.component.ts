import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Campaign } from '../../../../core/models/campaign';

interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  campaigns: Campaign[] = [];
  selectedCause = 'all';
  selectedRegion = 'all';
  selectedUrgency = 'all';

  causes: FilterOption[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'Éducation', label: 'Éducation' },
    { value: 'Santé', label: 'Santé' },
    { value: 'Social', label: 'Social' },
    { value: 'Environnement', label: 'Environnement' }
  ];

  regions: FilterOption[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'Centre', label: 'Centre' },
    { value: 'Littoral', label: 'Littoral' },
    { value: 'Nord', label: 'Nord' },
    { value: 'Sud', label: 'Sud' },
    { value: 'Ouest', label: 'Ouest' },
    { value: 'Est', label: 'Est' },
    { value: 'Extrême-Nord', label: 'Extrême-Nord' },
    { value: 'Nord-Ouest', label: 'Nord-Ouest' },
    { value: 'Sud-Ouest', label: 'Sud-Ouest' },
    { value: 'Adamaoua', label: 'Adamaoua' }
  ];

  urgencies: FilterOption[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'HIGH', label: 'Élevée' },
    { value: 'MEDIUM', label: 'Moyenne' },
    { value: 'LOW', label: 'Faible' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.get<Campaign[]>('/campaigns/active').subscribe({
      next: (data) => {
        this.campaigns = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error loading campaigns', err);
        this.loadFallbackCampaigns();
      }
    });
  }

  private loadFallbackCampaigns(): void {
    this.campaigns = [
      {
        id: '1',
        organizationId: 'org1',
        title: 'Fournitures scolaires pour 500 enfants',
        description: 'Aidez-nous à équiper les élèves défavorisés avec des cahiers, stylos et manuels pour une année scolaire réussie.',
        category: 'Éducation',
        location: 'Douala',
        region: 'Littoral',
        targetAmount: 5000000,
        currentAmount: 3500000,
        status: 'ACTIVE',
        urgency: 'HIGH'
      },
      {
        id: '2',
        organizationId: 'org2',
        title: 'Soutien à la clinique mobile de Bafoussam',
        description: 'Permettez aux communautés isolées d\'accéder à des consultations médicales et des médicaments vitaux.',
        category: 'Santé',
        location: 'Bafoussam',
        region: 'Ouest',
        targetAmount: 10000000,
        currentAmount: 8200000,
        status: 'ACTIVE',
        urgency: 'MEDIUM'
      },
      {
        id: '3',
        organizationId: 'org3',
        title: 'Formation professionnelle pour jeunes sans emploi',
        description: 'Offrez un avenir aux jeunes en leur enseignant des métiers porteurs et en favorisant leur insertion.',
        category: 'Social',
        location: 'Yaoundé',
        region: 'Centre',
        targetAmount: 6000000,
        currentAmount: 4100000,
        status: 'ACTIVE',
        urgency: 'MEDIUM'
      }
    ];
  }

  get filteredCampaigns(): Campaign[] {
    return this.campaigns.filter((c) => {
      const matchCause = this.selectedCause === 'all' || c.category === this.selectedCause;
      const matchRegion = this.selectedRegion === 'all' || c.region === this.selectedRegion;
      const matchUrgency =
        this.selectedUrgency === 'all' ||
        c.urgency === this.selectedUrgency ||
        (this.selectedUrgency === 'HIGH' && c.urgency === 'CRITICAL');
      return matchCause && matchRegion && matchUrgency;
    });
  }

  selectCause(value: string): void {
    this.selectedCause = value;
  }

  selectRegion(value: string): void {
    this.selectedRegion = value;
  }

  selectUrgency(value: string): void {
    this.selectedUrgency = value;
  }

  getCardImage(campaign: Campaign): string {
    const img = campaign.images?.[0];
    const url = img ? (img.startsWith('http') ? img : img) : 'assets/images/hero-classroom.png';
    return `url(${url})`;
  }
}
