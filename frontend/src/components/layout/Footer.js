import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiGithub, FiTwitter, FiMail, FiCode, FiAward, FiHome, FiUser, FiHelpCircle, FiFileText, FiShield } from 'react-icons/fi';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const LogoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary[100]};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    transform: translateY(-2px);
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LinkItem = styled.li`
  a {
    color: ${({ theme }) => theme.colors.text.secondary};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease-in-out;
    padding: 0.5rem 0;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
      padding-left: 0.5rem;
    }
    
    svg {
      opacity: 0.7;
    }
  }
`;

const Divider = styled.div`
  grid-column: 1 / -1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.secondary[200]};
  margin: 2rem 0;
`;

const BottomBar = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo>
            <LogoIcon>
              <FiBookOpen size={20} />
            </LogoIcon>
            QuizMaster
          </Logo>
          <Description>
            Test your knowledge with our interactive quiz platform. Challenge yourself with 
            quizzes on various topics and compete with others on the leaderboard.
          </Description>
          <SocialLinks>
            <SocialLink href="#" aria-label="GitHub">
              <FiGithub size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FiTwitter size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Email">
              <FiMail size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3><FiHome size={20} /> Quick Links</h3>
          <LinkList>
            <LinkItem>
              <Link to="/">
                <FiHome size={16} />
                Home
              </Link>
            </LinkItem>
            <LinkItem>
              <Link to="/quizzes">
                <FiBookOpen size={16} />
                Browse Quizzes
              </Link>
            </LinkItem>
            <LinkItem>
              <Link to="/leaderboard">
                <FiAward size={16} />
                Leaderboard
              </Link>
            </LinkItem>
            <LinkItem>
              <Link to="/dashboard">
                <FiUser size={16} />
                Dashboard
              </Link>
            </LinkItem>
          </LinkList>
        </FooterSection>

        <FooterSection>
          <h3><FiHelpCircle size={20} /> Support</h3>
          <LinkList>
            <LinkItem>
              <a href="#">
                <FiHelpCircle size={16} />
                Help Center
              </a>
            </LinkItem>
            <LinkItem>
              <a href="#">
                <FiMail size={16} />
                Contact Us
              </a>
            </LinkItem>
            <LinkItem>
              <a href="#">
                <FiHelpCircle size={16} />
                FAQ
              </a>
            </LinkItem>
            <LinkItem>
              <a href="#">
                <FiCode size={16} />
                API Documentation
              </a>
            </LinkItem>
          </LinkList>
        </FooterSection>

        <FooterSection>
          <h3><FiShield size={20} /> Legal</h3>
          <LinkList>
            <LinkItem>
              <a href="#">
                <FiFileText size={16} />
                Privacy Policy
              </a>
            </LinkItem>
            <LinkItem>
              <a href="#">
                <FiFileText size={16} />
                Terms of Service
              </a>
            </LinkItem>
            <LinkItem>
              <a href="#">
                <FiFileText size={16} />
                Cookie Policy
              </a>
            </LinkItem>
          </LinkList>
        </FooterSection>

        <Divider />

        <BottomBar>
          <Copyright>
            &copy; {currentYear} QuizMaster. All rights reserved.
          </Copyright>
          <LegalLinks>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </LegalLinks>
        </BottomBar>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
