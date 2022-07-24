import React, { useState } from 'react';
import { Button, Columns, Modal } from 'react-bulma-components';

interface ButtonProps {
    readonly handleClick: () => void;
    readonly isDisabled: boolean;
    readonly text: string;
    readonly alt?: string;
    readonly icon?: string;
    readonly image?: string;
    readonly title?: string;
    readonly verifyOnClick?: boolean;
}

function RefreshButton({
    title = '',
    isDisabled,
    handleClick,
    icon = '',
    alt = '',
    image = '',
    text,
    verifyOnClick = false
}: ButtonProps) {
    const [showModal, setShowModal] = useState(false);
    function onClick() {
        if (verifyOnClick && !showModal) {
            setShowModal(true);
        } else {
            setShowModal(false);
            handleClick();
        }
    }
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
                {icon && (
                    <i className={`${icon} ${verifyOnClick ? 'has-text-white' : 'has-text-black'} btn-icon mr-4`} />
                )}
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
                                Rebooting the system will cause this web app to temporarily go down. It should only take
                                a few minutes.
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
