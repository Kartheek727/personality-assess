import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsAndConditions = () => (
  <Container>
    <Box my={4}>
      <Typography variant="h4" gutterBottom>Terms and Conditions</Typography>
      <Typography paragraph>
        Welcome to MindAvenues, a platform dedicated to providing psychological assessments. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully. If you do not agree with any part of these terms, you must not use our services.
      </Typography>
      <Typography paragraph>
        Our psychological assessments are digital services designed to offer insights into your mental well-being. The content, tools, and results provided are for informational purposes only and are not a substitute for professional psychological or medical advice. We reserve the right to update or modify these terms and our services at any time without prior notice.
      </Typography>
      <Typography paragraph>
        All purchases of assessments are final. Due to the immediate delivery of digital content upon payment, we do not offer cancellations or refunds. By completing a purchase, you acknowledge and accept this policy.
      </Typography>
      <Typography paragraph>
        You are responsible for maintaining the confidentiality of your account and for all activities under your account. Unauthorized use of our services or attempts to interfere with their functionality may result in termination of your access.
      </Typography>
    </Box>
  </Container>
);

const PrivacyPolicy = () => (
  <Container>
    <Box my={4}>
      <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
      <Typography paragraph>
        At MindAvenues, we are committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, and protect your personal information while you use our psychological assessment platform.
      </Typography>
      <Typography paragraph>
        We collect personal data such as your name, email address, and responses to assessment questions when you register, complete assessments, or contact us. This information is used exclusively to deliver your assessment results, improve our services, and communicate with you about your account or updates.
      </Typography>
      <Typography paragraph>
        Your data is stored securely and is not shared with third parties except as required by law or to process payments through trusted providers (e.g., Razorpay). We implement industry-standard security measures to protect your information from unauthorized access or disclosure.
      </Typography>
      <Typography paragraph>
        By using our services, you consent to the collection and use of your data as outlined here. For questions about your privacy, please contact us at support@mindavenues.com.
      </Typography>
    </Box>
  </Container>
);

const DeliveryPolicy = () => (
  <Container>
    <Box my={4}>
      <Typography variant="h4" gutterBottom>Shipping Policy</Typography>
      <Typography paragraph>
        MindAvenues provides digital psychological assessments delivered instantly upon successful payment. Once you complete your purchase, your assessment results or access to the assessment tool will be available immediately within your account dashboard.
      </Typography>
      <Typography paragraph>
        There are no physical products shipped as part of our service. Delivery timelines depend solely on the completion of payment verification, which typically occurs within minutes. In rare cases of technical issues, please contact support@mindavenues.com for assistance.
      </Typography>
    </Box>
  </Container>
);

const ContactUs = () => (
  <Container>
    <Box my={4}>
      <Typography variant="h4" gutterBottom>Contact Us</Typography>
      <Typography paragraph>
        We’re here to support you with your psychological assessment experience. For inquiries, technical assistance, or feedback about MindAvenues, please reach out using the details below:
      </Typography>
      <Typography paragraph>
        <strong>Email:</strong> support@mindavenues.com
      </Typography>
      <Typography paragraph>
        <strong>Phone:</strong> +91 987 654 3210
      </Typography>
      <Typography paragraph>
        <strong>Address:</strong> MindAvenues Pvt. Ltd., 456 Wellness Road, Bengaluru, Karnataka, India
      </Typography>
      <Typography paragraph>
        Our team responds to inquiries within 24-48 hours, Monday through Friday. For urgent matters, please include “URGENT” in your email subject line.
      </Typography>
    </Box>
  </Container>
);

const CancellationAndRefunds = () => (
  <Container>
    <Box my={4}>
      <Typography variant="h4" gutterBottom>Cancellation and Refunds</Typography>
      <Typography paragraph>
        At MindAvenues, all psychological assessments are digital services delivered instantly upon payment. Due to the nature of these services, we do not offer cancellations or refunds once a purchase is completed.
      </Typography>
      <Typography paragraph>
        Before completing your payment, please ensure you understand that access to the assessment or its results is provided immediately, making all transactions final. If you encounter technical difficulties or have questions about your purchase, contact us at support@mindavenues.com, and we’ll assist you promptly.
      </Typography>
      <Typography paragraph>
        This policy is in place to reflect the immediate delivery and non-reversible nature of digital content. We appreciate your understanding and encourage you to review your selection carefully before proceeding.
      </Typography>
    </Box>
  </Container>
);

export { TermsAndConditions, PrivacyPolicy, DeliveryPolicy, ContactUs, CancellationAndRefunds };