import { NextFunction, Request, Response } from 'express';
import cron from 'node-cron';
import { User, Assessment, Payment } from '../models';
import { PaymentStatus } from '../types';
import { sendReminderEmail } from '../services/email.service';

const reminderEmailMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  const reminderTime = process.env.REMINDER_TIME || '0 * * * * *'; // Every minute for testing
  const frontendUrl = process.env.FRONTEND_URL_EMAIL || 'http://localhost:3000';

  console.log('Initializing reminder email middleware');
  console.log('Cron schedule:', reminderTime);
  console.log('Frontend URL:', frontendUrl);
  console.log('Server timezone:', process.env.TZ || 'Not set (using Asia/Kolkata in cron)');

  cron.schedule(reminderTime, async () => {
    console.log('Cron job triggered at:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    try {
      // Fetch all active assessments
      const allAssessments = await Assessment.find({ isActive: true });
      const totalAssessmentsCount = allAssessments.length;
      console.log(`Found ${totalAssessmentsCount} active assessments`);

      // Fetch all verified users
      const users = await User.find({ isVerified: true }).select('email firstName paymentStatus completedAssessments');
      console.log(`Found ${users.length} verified users`);

      if (users.length === 0) {
        console.log('No verified users found; skipping email sending');
        return;
      }

      for (const user of users) {
        const userId = user._id.toString();
        const userEmail = user.email;
        const userName = user.firstName;

        // 1. Check for unpaid users
        const payment = await Payment.findOne({ user: userId });
        console.log(`User ${userEmail}: Payment status - ${payment ? payment.status : 'No payment found'}`);

        if (!payment || payment.status !== PaymentStatus.COMPLETED) {
          const paymentSubject = 'Complete Your Payment to Access the Personality Test';
          const paymentBody = `
            <h2>Hello ${userName},</h2>
            <p>We noticed you haven’t completed your payment yet. To unlock the full personality test experience, please make your payment now!</p>
            <p><a href="${frontendUrl}/payment">Click here to pay</a></p>
            <p>Thank you for choosing us!</p>
          `;
          try {
            await sendReminderEmail(userEmail, paymentSubject, paymentBody);
            console.log(`Payment reminder sent successfully to ${userEmail}`);
          } catch (emailError) {
            console.error(`Failed to send payment reminder to ${userEmail}:`, emailError);
          }
        } else {
          console.log(`User ${userEmail} has completed payment; skipping payment reminder`);
        }

        // 2. Check for users with incomplete assessments
        const completedAssessmentIds = user.completedAssessments.map((ca) => ca.assessment.toString());
        const completedCount = completedAssessmentIds.length;
        console.log(`User ${userEmail}: Completed ${completedCount} out of ${totalAssessmentsCount} assessments`);

        if (completedCount > 0 && completedCount < totalAssessmentsCount) {
          const remainingAssessments = allAssessments.filter(
            (assessment) => !completedAssessmentIds.includes(assessment._id.toString())
          );
          const remainingTitles = remainingAssessments.map((a) => a.title).join(', ');
          console.log(`User ${userEmail}: Remaining assessments - ${remainingTitles}`);

          const assessmentSubject = 'Complete Your Remaining Assessments';
          const assessmentBody = `
            <h2>Hello ${userName},</h2>
            <p>You’ve made great progress by completing ${completedCount} out of ${totalAssessmentsCount} assessments!</p>
            <p>Please complete the remaining assessments: <strong>${remainingTitles}</strong>.</p>
            <p><a href="${frontendUrl}/assessments">Click here to continue</a></p>
            <p>We’re excited to see your full results!</p>
          `;
          try {
            await sendReminderEmail(userEmail, assessmentSubject, assessmentBody);
            console.log(`Assessment reminder sent successfully to ${userEmail}`);
          } catch (emailError) {
            console.error(`Failed to send assessment reminder to ${userEmail}:`, emailError);
          }
        } else {
          console.log(`User ${userEmail}: No incomplete assessments (Completed: ${completedCount}, Total: ${totalAssessmentsCount})`);
        }
      }
    } catch (error) {
      console.error('Error in reminder email task:', error);
    }
  }, {
    timezone: 'Asia/Kolkata' // Ensure cron runs in IST
  });

  next();
};

export default reminderEmailMiddleware;