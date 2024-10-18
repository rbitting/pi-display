import React, { useState } from 'react';
import { Button, Columns, Modal } from 'react-bulma-components';

/**
 * Allowed propertise for the {@link RefreshButton}
 */
interface ButtonProps {
  /** Alt text for the button */
  readonly alt?: string;
  /** A click handler for the button */
  readonly handleClick: () => void;
  /** Icon to render in the button @example "fas fa-info-circle" */
  readonly icon?: string;
  /** The url for an image to display in the button */
  readonly image?: string;
  /** Whether the button is disabled */
  readonly isDisabled: boolean;
  /** Text to display in the button */
  readonly text: string;
  /** Title attribute for the button */
  readonly title?: string;
  /** Whether a verification dialog should be displayed to the user on click */
  readonly verifyOnClick?: boolean;
}

/**
 * A component for rendering a reusable button
 * @returns The button component
 */
function RefreshButton({
  title = '',
  isDisabled,
  handleClick,
  icon = '',
  alt = '',
  image = '',
  text,
  verifyOnClick = false
}: ButtonProps): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);

  /**
   * Handles click events on the button
   */
  const onClick = (): void => {
    if (verifyOnClick && !showModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
      handleClick();
    }
  };

  return (
    <>
      <Button
        fullwidth
        color={verifyOnClick ? 'danger' : 'grey-light'}
        title={title}
        className="p-2 is-size-5"
        disabled={isDisabled}
        onClick={() => onClick()}
      >
        {icon && <i className={`${icon} ${verifyOnClick ? 'has-text-white' : 'has-text-black'} btn-icon mr-4`} />}
        {!icon && <img alt={alt} src={image} />}
        {text}
      </Button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Card>
          <Modal.Card.Header showClose={false}>
            <Modal.Card.Title className="has-text-light">
              Are you sure you want to {title.toLowerCase()}?
            </Modal.Card.Title>
          </Modal.Card.Header>
          <Modal.Card.Body className="has-text-dark">
            {text === 'Reboot' && (
              <>
                Rebooting the system will cause this web app to temporarily go down. It should only take a few minutes.
              </>
            )}
          </Modal.Card.Body>
          <Modal.Card.Footer className="has-background-light is-block">
            <Columns breakpoint="mobile" mobile={{ gap: '1' }}>
              <Columns.Column mobile={{ size: 6 }} tablet={{ size: 6 }} desktop={{ size: 6 }}>
                <Button color="danger" fullwidth onClick={() => onClick()}>
                  Yes, {text}
                </Button>
              </Columns.Column>
              <Columns.Column mobile={{ size: 6 }} tablet={{ size: 6 }} desktop={{ size: 6 }}>
                <Button color="success" fullwidth onClick={() => setShowModal(false)}>
                  Nevermind
                </Button>
              </Columns.Column>
            </Columns>
          </Modal.Card.Footer>
        </Modal.Card>
      </Modal>
    </>
  );
}

export default RefreshButton;
