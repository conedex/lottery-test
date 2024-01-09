import React from "react";
import { Modal } from "antd";

const ProfileModal = ({ isModalVisible, handleOk, account }) => {
  return (
    <Modal
      title="Profile"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleOk}
      footer={null}
    >
      <p className="modal-wallet-info">
        Account Wallet:{" "}
        <a
          href={`https://polygonscan.com/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {account}
        </a>
      </p>
    </Modal>
  );
};

export default ProfileModal;
