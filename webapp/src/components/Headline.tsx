import React from 'react';
import Loading from './Loading';

/**
 * Allowed propertise for the {@link Headline} component
 */
interface HeadlineProps {
  /** A font awesome icon to display in the heading @example "fas fa-info-circle" */
  readonly icon: string;
  /** Whether the display is currently processing */
  readonly isProcessing?: boolean;
  /** The title to render in the headline */
  readonly title: string;
}

/**
 * A component to render a heading
 * @returns The headline component
 */
function Headline({ icon, isProcessing, title }: HeadlineProps): JSX.Element {
  return (
    <div className="is-flex mb-3">
      {!isProcessing && (
        <span className="is-flex is-flex-direction-column is-justify-content-center mr-4">
          <i className={`is-size-4-mobile is-size-3-tablet is-size-3-desktop ${icon}`} />
        </span>
      )}
      {isProcessing && (
        <span className="mr-3">
          <Loading />
        </span>
      )}
      <h1 className="title is-size-4-mobile is-size-3-tablet is-size-2-desktop mb-0">{title}</h1>
    </div>
  );
}

Headline.defaultProps = {
  isProcessing: false
};

export default Headline;
