import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-policy',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <section class="policy-section">
      <div class="policy-container">
        <h1>{{ title }}</h1>
        <div class="policy-content" [innerHTML]="content"></div>
        <div class="actions">
            <a routerLink="/" class="back-link">← Back to Home</a>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .policy-section {
      padding: 100px 20px 60px;
      background-color: #fdfdfd;
      min-height: 80vh;
      font-family: 'Inter', sans-serif;
    }
    .policy-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    h1 {
      font-family: 'Playfair Display', serif;
      color: #123b2b;
      font-size: 2.5rem;
      margin-bottom: 30px;
      text-transform: capitalize;
    }
    .policy-content {
      line-height: 1.8;
      color: #555;
    }
    ::ng-deep .policy-content h3 {
        color: #123b2b;
        margin-top: 25px;
        font-size: 1.2rem;
    }
    ::ng-deep .policy-content p {
        margin-bottom: 15px;
    }
    ::ng-deep .policy-content ul {
        margin-bottom: 20px;
        padding-left: 20px;
    }
    ::ng-deep .policy-content li {
        margin-bottom: 10px;
    }
    .actions {
        margin-top: 40px;
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
    .back-link {
        color: #123b2b;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s;
    }
    .back-link:hover {
        color: #4CAF50;
    }
  `]
})
export class PolicyComponent implements OnInit {
    type: string = '';
    title: string = '';
    content: string = '';

    private policies: any = {
        'shipping': {
            title: 'Shipping Policy',
            content: `
        <p>At Greenie Culture, we strive to deliver your green friends safely and quickly.</p>
        <h3>Processing Time</h3>
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        <h3>Shipping Rates & Delivery Estimates</h3>
        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
        <ul>
            <li><strong>Standard Shipping:</strong> 3-5 business days</li>
            <li><strong>Express Shipping:</strong> 1-2 business days</li>
        </ul>
        <h3>Damages</h3>
        <p>Greenie Culture is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.</p>
      `
        },
        'returns': {
            title: 'Returns & Exchanges',
            content: `
        <p>We want you to be completely satisfied with your purchase.</p>
        <h3>Return Policy</h3>
        <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.</p>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
        <h3>Non-returnable items:</h3>
        <ul>
            <li>Perishable goods (some specific plants if mishandled)</li>
            <li>Gift cards</li>
        </ul>
        <h3>Exchanges</h3>
        <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at support@greenie.com.</p>
      `
        },
        'privacy': {
            title: 'Privacy Policy',
            content: `
        <p>Your privacy is important to us.</p>
        <h3>Information Collection</h3>
        <p>We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us.</p>
        <h3>Use of Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, such as to administer your account, process your orders, and send you technical notices.</p>
      `
        },
        'terms': {
            title: 'Terms of Service',
            content: `
        <p>By accessing this website we assume you accept these terms and conditions.</p>
        <h3>License</h3>
        <p>Unless otherwise stated, Greenie Culture and/or its licensors own the intellectual property rights for all material on Greenie Culture. All intellectual property rights are reserved.</p>
        <h3>User Comments</h3>
        <p>Certain parts of this website offer the opportunity for users to post and exchange opinions and information in certain areas of the website. Greenie Culture does not filter, edit, publish or review Comments prior to their presence on the website.</p>
      `
        }
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.type = params['type'];
            const policy = this.policies[this.type];
            if (policy) {
                this.title = policy.title;
                this.content = policy.content;
            } else {
                this.title = 'Page Not Found';
                this.content = '<p>The policy page you are looking for does not exist.</p>';
            }
            window.scrollTo(0, 0);
        });
    }
}
