import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss'
})
export class AdmindashboardComponent implements AfterViewInit {
  @ViewChild('mainChart') mainChartCanvas!: ElementRef;

  activeTab = 'overview';

  categoryProjects = [
    { label: 'ÉDUCATION',   pct: 45, color: '#1a4a3a' },
    { label: 'SANTÉ',       pct: 30, color: '#1a4a3a' },
    { label: 'EAU & HYGIÈNE', pct: 15, color: '#F59542' },
    { label: 'URGENCE',     pct: 10, color: '#e53935' }
  ];

  pendingNgos = [
    { initials: 'ED', color: '#1a4a3a', name: 'Espoir de Douala', sub: 'Humanitaire • Douala',
      risk: 'CRITIQUE', riskLevel: 'Critique', docs: 8 },
    { initials: 'AS', color: '#F59542', name: 'Avenir Sahel', sub: 'Éducation • Maroua',
      risk: 'NORMAL', riskLevel: 'Normal', docs: 3 },
    { initials: 'WF', color: '#4caf50', name: 'Water First', sub: 'Eau • Garoua',
      risk: 'NORMAL', riskLevel: 'Normal', docs: 5 }
  ];

  lastReports = [
    { icon: 'description', iconBg: '#fff3e0', iconColor: '#F59542',
      title: "Don de 5M FCFA", meta: 'par Arthur M. • il y a 2h', tags: ['Santé', 'Douala'] },
    { icon: 'verified', iconBg: '#e8f5e9', iconColor: '#4caf50',
      title: 'Don de 1.2M FCFA', meta: "par Marie K. • Aujourd'hui", hash: '0x9c41...a12c' },
    { icon: 'shopping_bag', iconBg: '#e3f2fd', iconColor: '#2196f3',
      title: 'Don en Nature (Sacs)', meta: 'par Coopérative Douala • il y a 5h' }
  ];

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    const ctx = this.mainChartCanvas.nativeElement.getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct'],
        datasets: [
          {
            label: 'Dons Cash',
            data: [4200000, 5800000, 4900000, 7200000, 6100000, 8500000],
            borderColor: '#1a4a3a',
            backgroundColor: 'rgba(26, 74, 58, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#1a4a3a'
          },
          {
            label: 'Dons Nature',
            data: [1200000, 2100000, 1500000, 2800000, 2200000, 3100000],
            borderColor: '#F59542',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        layout: {
          padding: { left: -10, right: 0, top: 0, bottom: 0 }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            display: false,
            grid: { display: false }
          },
          x: { 
            grid: { display: false },
            ticks: { font: { weight: 'bold' } },
            offset: false
          }
        }
      }
    });
  }
}
