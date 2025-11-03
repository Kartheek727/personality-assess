// src/components/(About)/About.tsx
import React from "react";
import { NextPage } from "next";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  Divider,
  Button,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CircularText: React.FC<{ years: number }> = ({ years }) => {
  return (
    <div className="relative w-32 h-32">
      <svg
        className="absolute top-0 left-0 w-full h-full animate-spin-slow"
        viewBox="0 0 100 100"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
        </defs>
        <text fill="#1a62a4" fontSize="8">
          <textPath xlinkHref="#circlePath">
            Years Of Experience • Years Of Experience • Years Of Experience •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg border-2 border-[#f47528]/50">
          <span className="text-3xl font-bold text-[#1a62a4]">{years}</span>
        </div>
      </div>
    </div>
  );
};

const StatCounter: React.FC<{ value: number; label: string; suffix?: string }> = ({
  value,
  label,
  suffix,
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Box className="text-center p-4 rounded-lg hover:shadow-md transition-shadow">
      <Box className="mb-3 flex justify-center items-baseline">
        <Typography variant="h3" sx={{ color: "#1a62a4", fontWeight: 700 }}>
          {count}
        </Typography>
        {suffix && (
          <Typography variant="h5" sx={{ color: "#f47528", ml: 1 }}>
            {suffix}
          </Typography>
        )}
      </Box>
      <Typography variant="overline" sx={{ color: "#045494" }}>
        {label}
      </Typography>
    </Box>
  );
};

const ObjectiveItem: React.FC<{ number: string; text: string }> = ({ number, text }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex mb-4 items-start bg-white p-4 rounded-lg shadow-sm"
    >
      <Box
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-3"
        sx={{ bgcolor: "#1a62a4" }}
      >
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
          {number}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "#045494", pt: 1 }}>
        {text}
      </Typography>
    </motion.div>
  );
};

const ServiceItem: React.FC<{ title: string; iconSrc: string }> = ({ title, iconSrc }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-[#f47528]/5"
    >
      <Box
        className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
        sx={{ bgcolor: "#1a62a4" }}
      >
        <Image src={iconSrc} width={32} height={32} alt={title} />
      </Box>
      <Typography variant="subtitle1" sx={{ color: "#045494", fontWeight: 500 }}>
        {title}
      </Typography>
    </motion.div>
  );
};

const GradientHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Typography
      variant="h4"
      className="mb-8 uppercase tracking-wider"
      sx={{
        fontWeight: 700,
        backgroundImage: "linear-gradient(to right, #1a62a4, #f47528)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </Typography>
  );
};

const About: NextPage = () => {

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      {/* About Us Section */}
      <Box className="py-16" id="founders">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <GradientHeading>About Us</GradientHeading>
          </Box>

          {/* First Founder */}
          <Grid container spacing={6} className="mb-16">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h5"
                sx={{ color: "#1a62a4", fontWeight: 600, mb: 4 }}
              >
                Founders
              </Typography>
              <Typography variant="h6" sx={{ color: "#045494", mb: 2, fontWeight: 700 }}>
                Dr. Damera Vijayalakshmi LLM, PhD(Psy), PhD(Edn)
              </Typography>
              <Typography variant="body1" sx={{ color: "#045494", lineHeight: 1.8 }}>
              Mind Avenues is the brain child of Psychologist and Educationist Dr
                  Damera Vijayalakshmi whose evidence based experiential learnings
                  over the past thirty plus years, serves as the grass root philosophy of the
                  organisation. Dr Damera&apos;s theory is based on the central concept of The
                  Inner Mind Map which aids us in understanding innate behaviour and
                  how one is designed from within. This knowledge thereby enables
                  understanding of the unique potential of people and hence provides
                  various avenues for personal health, growth, well-being and ultimately
                  happiness. Her theory can be seen to be instrumental in helping to lay
                  the foundation in the deeper understanding of Mind Sciences. As the
                  founder of this unique concept, she has proved over the years to her
                  clients that she is an experienced, trustworthy, reliable source of support
                  and guidance. As a Psychologist, Educationist and a Success Strategist
                  she has used her lifetime of practical experiential truths, to empower and
                  help clients face the spectrum of challenges in their life. Her vast
                  experience and her theory has been sculpted into a piece of art which
                  now culminates into a unique masterpiece called &quot;Inner Mind Map&quot;.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box className="relative">
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    border: "2px solid #f47528",
                  }}
                >
                  <Image
                    src="/img/about/t1.jpg"
                    alt="Dr. Damera Vijayalakshmi"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </Card>
                <Box className="absolute -bottom-8 -right-8">
                  <CircularText years={35} />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Second Founder */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={5} className="order-2 order-md-1">
              <Box className="relative">
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    border: "2px solid #f47528",
                  }}
                >
                  <Image
                    src="/img/about/t6.jpg"
                    alt="Dr Kotra Krishna Mohan"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </Card>
                <Box className="absolute -bottom-8 -left-8">
                  <CircularText years={25} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7} className="order-1 order-md-2">
              <Typography variant="h6" sx={{ color: "#045494", mb: 2, fontWeight: 700 }}>
                Dr Kotra Krishna Mohan PhD(Psy)
              </Typography>
              <Typography variant="body1" sx={{ color: "#045494", lineHeight: 1.8 }}>
              Psychologist, Dr Kotra Krishna Mohan, a true academic and
                  professional, and has worked in reputed universities and mental health
                  institutes in India and abroad. Dr Mohan&apos;s innovative research,
                  publications and awards at international level established him as an
                  International behavioural scientist. His vision of establishing and starting
                  psychology academic and professional training programmes and mental
                  health services at various universities and institutes has had a high
                  impact in the field of Psychology. It is with a divine inclination that Dr
                  Kotra joined forces with Dr Damera on the journey of establishing the
                  Inner Psychological Oneness Movement by founding the organisation
                  &quot;Mind Avenues Potential Systems&quot;. The collaboration of Dr Kotra and Dr
                  Damera has added value to the global demand of a deeper
                  understanding and solutions for human behaviour that the world is
                  looking for. Their innovative and effective approaches for mental well-
                  being and happiness has led both to work for the establishment of the
                  Inner Psychological Oneness Movement.              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box className="py-16 bg-[#f47528]/5">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { value: 9327, label: "Satisfied Clients", suffix: "+" },
              { value: 99, label: "Positive Feedback", suffix: "%" },
              { value: 1257, label: "Programs Conducted", suffix: "+" },
              { value: 24, label: "Awards Won" },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCounter {...stat} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Vision Section */}
      <Box className="py-16" id="vision">
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/img/vision.png"
                  alt="Our Vision"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <GradientHeading>Our Vision</GradientHeading>
              <Box className="space-y-4">
                <Typography variant="body1" sx={{ color: "#045494" }}>
                  Mind Avenues is a unique technology-driven global initiative offering
                  professional psychological and behavioral services for Personal, Educational and Professional development.
                </Typography>
                {/* Add other paragraphs similarly */}
                <Typography variant="body1" sx={{ color: "#045494" }}>
                    Mind Avenues aims to foster Self-Awareness, Self-Realization and Self-Transformation
                    by nurturing mankind on to the path of positive transformation through a self-directed
                    learning and interventional approach.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#045494" }}>
                  This is achieved through self-assessment and self-mastery modules which are
                    diagnostic, preventive and interventional services for psychological well-being.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#045494" }}>
                  Mind Avenues is committed to offering its services in the areas of Mental Health
                    Development, Human Potential Enhancement and Psychological Wellness and Happiness.
                  </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box className="py-16" id="mission">
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <GradientHeading>Our Mission</GradientHeading>
              <Box className="space-y-4">
                <Typography variant="body1" sx={{ color: "#045494" }}>
                To provide a platform for identification and understanding the
                    true essence of a person&apos;s unique mind and behaviour through
                    a self-reflective learning, and an introspective approach.
                </Typography>
                {/* Add other paragraphs similarly */}
                <Typography variant="body1" sx={{ color: "#045494" }}>
                    To provide an opportunity to discover one&apos;s own Inner Mind Map
                    and channelize this mind potential to nurture positive psychological
                    and behavioural change.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#045494" }}>
                  To facilitate change from a state of dissatisfaction through an
                    inward journey exploring the avenues of one&apos;s own mind and
                    thereby attain positive mental health.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#045494" }}>
                  To nurture a person to the path of positive transformation
                    through a self-directed learning and interventional approach.
                  </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/img/mission.png"
                  alt="Our Mission"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Commitment Section */}
      <Box className="py-16" id="commitment">
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/img/newcommit.png"
                  alt="Our Commitment"
                  width={450}
                  height={350}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <GradientHeading>Our Commitment</GradientHeading>
              <Box className="space-y-4">
                <Typography variant="body1" sx={{ color: "#045494" }}>
                Mind Avenues offers technology driven services which support mental health and
                well-being through online self-assessment and self-mastery modules.
                </Typography>
                {/* Add other paragraphs similarly */}
                <Typography variant="body1" sx={{ color: "#045494" }}>
                    The designed diagnostic and intervention modules are self-directed,
                    self-learning oriented, having a step-by-step guided approach to positive life transformation.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#045494" }}>
                  Services facilitate quick instant understanding, and insight-driven
                    cognitive interventions to bring about behavioural, emotional and social changes.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#045494" }}>
                  It combats the challenge of stigma by making it online, and thereby anonymity is
                    ensured.
                  </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box className="py-16" sx={{ bgcolor: "#f47528]/5" }}>
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <GradientHeading>Areas Of Services</GradientHeading>
          </Box>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <ServiceItem
                title="Positive Parenting and Child Development"
                iconSrc="/img/parenting.png"
              />
              <ServiceItem
                title="Youth and Adult Potential Identifiers"
                iconSrc="/img/youth.png"
              />
              <ServiceItem
                title="Emotional, Behavioural and Relationship Challenges"
                iconSrc="/img/emotional.png"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Image
                src="/img/areaofservice.png"
                alt="Areas of Service"
                width={350}
                height={350}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ServiceItem
                title="360-degree Analysis and Productivity"
                iconSrc="/img/360-degree.gif"
              />
              <ServiceItem
                title="Graceful Aging and Peaceful Lifestyle"
                iconSrc="/img/graceful.png"
              />
              <ServiceItem title="Pillars for Happiness" iconSrc="/img/pillars.png" />
            </Grid>
          </Grid>

          <Box className="text-center mt-12">
            <Typography variant="subtitle1" sx={{ color: "#045494", mb: 4, fontStyle: "italic" }}>
            &quot;Explore the Avenues of Your Mind: Explore the Options and Possibilities of your Mind.&quot;
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/inner-mind-map"
              sx={{
                bgcolor: "#1a62a4",
                color: "#ffffff",
                borderRadius: "9999px",
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#f47528" },
              }}
            >
              Take Assessment Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Objectives Section */}
      <Box className="py-16" id="objectives">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <GradientHeading>Our Objectives</GradientHeading>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {[
                "01 - Mind Avenues is a unique global psychological wellness initiative.",
                "02 - Mind Avenues is committed to personal and professional services...",
                "03 - Mind Avenues develops the best approaches and interventions...",
                "04 - Mind Avenues offers a wide range of personal growth training...",
                "05 - Mind Avenues bring together a team of highly qualified...",
              ].map((text, index) => (
                <ObjectiveItem key={index} number={text.slice(0, 2)} text={text.slice(5)} />
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              {[
                "06 - Keeping in mind the concept of confidentiality and anonymity...",
                "07 - Mind Avenues focuses not just on the mental well-being...",
                "08 - Mind Avenues provides real-time, effective and affordable...",
                "09 - Mind Avenues primarily is intended for the child, youth...",
                "10 - Mind Avenues proposes a new understanding of the configuration...",
              ].map((text, index) => (
                <ObjectiveItem key={index} number={text.slice(0, 2)} text={text.slice(5)} />
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Professional Networking Section */}
      <Box className="py-16" id="networks">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <GradientHeading>Professional Networking | Centres</GradientHeading>
          </Box>

          <Box className="mb-16">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h5"
                  sx={{ color: "#1a62a4", fontWeight: 600, mb: 4, textAlign: "center" }}
                >
                  The Professional Networking
                </Typography>
                <Typography variant="body1" sx={{ color: "#045494", mb: 6 }}>
                Mind Avenues Potential Systems Private Limited provides professional networking of psychological services in India and worldwide. The activities cater to Personal, Educational and Professional services which include online and offline.

                </Typography>
                {[
                  "Consultation | Counselling Services",
                  "Training | Coaching Programs",
                  "Franchise | Partnerships Network Services",
                  "Profit Sharing Network Services",
                  "B2B | B2C Services",
                ].map((item, index) => (
                  <Box
                    key={index}
                    className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-3"
                  >
                    <Box
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      sx={{ bgcolor: "#1a62a4" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#045494" }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <Image
                  src="/img/network.png"
                  alt="Professional Networking"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 8, borderColor: "#1a62a4", opacity: 0.3 }} />

          <Box>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Image
                  src="/img/center.png"
                  alt="The Centres"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h5"
                  sx={{ color: "#1a62a4", fontWeight: 600, mb: 4, textAlign: "center" }}
                >
                  The Centres
                </Typography>
                <Typography variant="body1" sx={{ color: "#045494", mb: 6 }}>
                Mind Avenues Potential Systems Private Limited shall establish branded centres in India and across the globe which offer both Offline and Online services. The centres will offer following services like

                </Typography>
                {[
                  "Positive Psychological Health & Wellness Centres",
                  "Psychological Analytics Centres",
                  "Psychological Training and Coaching Centres",
                  "Psychological Research and Development Centres",
                ].map((item, index) => (
                  <Box
                    key={index}
                    className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-3"
                  >
                    <Box
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      sx={{ bgcolor: "#1a62a4" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#045494" }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>

          <Box className="text-center mt-12">
            <Typography variant="h6" sx={{ color: "#1a62a4", mb: 4 }}>
              FOR MORE INFORMATION ON BUSINESS TRANSACTIONS
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/contact-us"
              sx={{
                bgcolor: "#1a62a4",
                color: "#ffffff",
                borderRadius: "9999px",
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#f47528" },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;