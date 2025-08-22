import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  private compileTemplate(templateName: string, context: any): string {
    try {
      const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      this.logger.error(`Failed to compile template ${templateName}:`, error);
      // Fallback to simple template
      return this.getFallbackTemplate(templateName, context);
    }
  }

  private getFallbackTemplate(templateName: string, context: any): string {
    switch (templateName) {
      case 'seller-welcome':
        return `
          <h2>Welcome to Our E-commerce Platform!</h2>
          <p>Your seller account has been created successfully.</p>
          <p><strong>Email:</strong> ${context.email}</p>
          <p><strong>Temporary Password:</strong> ${context.password}</p>
          <p>Please change your password after first login.</p>
        `;
      case 'admin-welcome':
        return `
          <h2>Welcome to Our E-commerce Platform!</h2>
          <p>Your admin account has been created successfully.</p>
          <p><strong>Email:</strong> ${context.email}</p>
        `;
      default:
        return `<p>${context.message || 'Notification from our platform'}</p>`;
    }
  }

  async sendSellerWelcomeEmail(email: string, password: string): Promise<boolean> {
    try {
      const htmlContent = this.compileTemplate('seller-welcome', {
        email,
        password,
        platformName: process.env.PLATFORM_NAME || 'Our E-commerce Platform'
      });

      await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'E-commerce Platform'}" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Welcome to Our Seller Platform',
        html: htmlContent,
      });
      
      this.logger.log(`Welcome email sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending seller welcome email:', error);
      return false;
    }
  }

  async sendAdminWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const htmlContent = this.compileTemplate('admin-welcome', {
        email,
        name,
        platformName: process.env.PLATFORM_NAME || 'Our E-commerce Platform'
      });

      await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'E-commerce Platform'}" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Welcome to Our Admin Panel',
        html: htmlContent,
      });
      
      this.logger.log(`Welcome email sent successfully to admin ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending admin welcome email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const htmlContent = this.compileTemplate('password-reset', {
        email,
        resetLink,
        platformName: process.env.PLATFORM_NAME || 'Our E-commerce Platform'
      });

      await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'E-commerce Platform'}" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Password Reset Request',
        html: htmlContent,
      });
      
      this.logger.log(`Password reset email sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending password reset email:', error);
      return false;
    }
  }
}