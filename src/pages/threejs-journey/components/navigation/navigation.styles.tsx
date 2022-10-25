import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

import { ReactComponent as BackSvg } from '../../assets/back.svg';
import { ReactComponent as ExploreSvg } from '../../assets/magnifying-glass.svg';
import { ReactComponent as PlaySvg } from '../../assets/play.svg';

const hidefloat = keyframes`
  from {
    opacity: 0.9;
  }

  75% {
    opacity: 0.9;
  }

  to {
    opacity: 0;
  }
`;

export const FloatInfo = styled.div`
  position: absolute;
  margin-top: 1rem;
  z-index: var(--z-modal);

  display: flex;
  justify-content: center;
  width: 100%;

  color: var(--color-white);
  animation: ${hidefloat} 3s forwards;

  span {
    padding: 1rem;
    border: solid;
    border-width: 2px;
    border-color: var(--color-white);
    background-color: var(--color-background);

    @media (min-width: 1024px) {
      font-size: 1.875rem; /* 30px */
      line-height: 2.25rem; /* 36px */
    }
  }
`;

export const Nav = styled.nav`
  z-index: var(--z-high);
  position: fixed;
  padding: var(--size-2);
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: transparent;

  @media (min-width: 1024px) {
    /* padding: var(--size-7); */
    padding: ${(props) => props.theme.sizes['--size-7']};
  }
`;

export const UList = styled.ul`
  list-style-type: none;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: var(--size-2);
  color: var(--orange-0);

  &:hover {
    color: var(--orange-6);
  }
`;

export const ListButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (min-width: 1024px) {
    font-size: var(--size-7);
    line-height: var(--size-8);
  }
`;

export const RouterLink = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: inherit;

  @media (min-width: 1024px) {
    font-size: var(--size-7);
    line-height: var(--size-8);
  }
`;

const baseIconStyle = css`
  width: var(--size-4);
  height: var(--size-4);
  margin-right: var(--size-3);

  @media (min-width: 1024px) {
    width: var(--size-7);
    height: var(--size-7);
  }
`;

export const BackIcon = styled(BackSvg)`
  ${baseIconStyle}
`;

export const ExploreIcon = styled(ExploreSvg)`
  ${baseIconStyle}
`;

export const PlayIcon = styled(PlaySvg)`
  ${baseIconStyle}
`;
