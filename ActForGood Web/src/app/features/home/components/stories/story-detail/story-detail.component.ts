import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Story {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
}

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './story-detail.component.html',
  styleUrl: './story-detail.component.scss'
})
export class StoryDetailComponent implements OnInit, AfterViewInit {
  story?: Story;

  private stories: Story[] = [
    {
      id: 1,
      title: 'Comment la Blockchain sécurise vos dons',
      category: 'TECHNOLOGIE',
      date: '31 MAR 2026',
      image: '/assets/new-design/rebuild.png',
      excerpt: 'Découvrez les mécanismes techniques derrière notre architecture Web3 qui garantit une transparence immuable sur chaque transaction humanitaire.',
      author: 'Equipe Tech ActForGood',
      content: `
        <p>La transparence est au cœur de notre mission chez ActForGood. Pour la garantir sans faille, nous avons implémenté une architecture basée sur la blockchain.</p>
        <p>Chaque don effectué sur notre plateforme est enregistré sur un registre public immuable. Cela signifie que personne, pas même nous, ne peut modifier les données une fois qu'elles sont inscrites. Vous pouvez suivre votre franc symbolique de votre portefeuille jusqu'à l'orphelinat destinataire.</p>
        <h3>Pourquoi la Blockchain ?</h3>
        <p>Contrairement aux systèmes bancaires traditionnels où les transactions peuvent passer par de multiples intermédiaires avec des frais opaques, la blockchain permet des transferts directs (Peer-to-Peer) avec des frais minimes et une traçabilité en temps réel.</p>
        <p>Nous utilisons des "Smart Contracts" pour automatiser la libération des fonds uniquement lorsque les conditions de validation (reporting terrain, factures certifiées) sont remplies par les institutions partenaires.</p>
      `
    },
    {
      id: 2,
      title: "Rapport d'Impact Trimestriel : Q1 2026",
      category: 'IMPACT',
      date: '25 MAR 2026',
      image: '/assets/new-design/rapport.jpg',
      excerpt: 'Analyse détaillée des fonds alloués et des résultats obtenus sur le terrain. Plus de 500 enfants ont bénéficié de nos programmes ce trimestre.',
      author: 'Direction de l\'Impact',
      content: `
        <p>Le premier trimestre 2026 a été marqué par une accélération sans précédent de nos actions sur le terrain camerounais.</p>
        <p>Grâce à votre générosité, nous avons pu intervenir dans 12 orphelinats répartis sur 4 régions. Le rapport complet détaille l'allocation de chaque FCFA investi dans l'éducation, la santé et l'infrastructure.</p>
        <h3>Points clés du trimestre</h3>
        <ul>
          <li>520 kits scolaires distribués.</li>
          <li>3 nouveaux dortoirs éco-responsables inaugurés.</li>
          <li>1100 consultations médicales gratuites réalisées.</li>
        </ul>
        <p>Ce succès est le vôtre. Nous continuons de travailler pour que chaque enfant ait les mêmes chances de réussite.</p>
      `
    },
    {
      id: 3,
      title: 'Guide Complet du Donneur Responsable',
      category: 'GUIDE',
      date: '10 MAR 2026',
      image: '/assets/new-design/maria.png',
      excerpt: 'Les meilleures pratiques pour choisir ses actions de solidarité et maximiser l\'efficacité de son engagement social.',
      author: 'Comité Éthique',
      content: `
        <p>Donner est un acte noble, mais donner de manière responsable est un acte stratégique. Comment s'assurer que votre aide est réellement utile ?</p>
        <p>Ce guide vous accompagne dans votre démarche de solidarité. Nous y abordons les critères de sélection d'une association, l'importance de la récurrence des dons, et comment évaluer l'impact social réel sur le long terme.</p>
        <h3>Nos 3 conseils d'or</h3>
        <ol>
          <li>Privilégiez les associations qui publient des rapports d'audit réguliers.</li>
          <li>Choisissez des causes qui travaillent sur l'autonomisation plutôt que sur la simple assistance.</li>
          <li>Engagez-vous dans la durée pour permettre une planification sereine des projets.</li>
        </ol>
      `
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.story = this.stories.find(s => s.id === id);
    if (!this.story) {
        // Fallback or redirect if not found
        this.story = this.stories[0];
    }
  }

  ngAfterViewInit(): void {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = this.el.nativeElement.querySelectorAll('.reveal');
    revealElements.forEach((element: HTMLElement) => {
      observer.observe(element);
    });
  }
}
