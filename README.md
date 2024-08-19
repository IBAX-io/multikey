# multikey - IBAX Network MultiSig Wallet

Welcome to multikey, a MultiSig wallet project designed for the IBAX network. This project provides a secure and efficient way to manage multi-signature wallets on the IBAX blockchain network. Multi-signature (MultiSig) wallets require multiple private keys to authorize a transaction, enhancing security by distributing control.

## Features

- **Enhanced Security**: Transactions require multiple approvals, reducing the risk of unauthorized transfers.
- **Decentralized Control**: Multiple stakeholders can manage funds collectively.
- **User-Friendly Interface**: Easy to use and intuitive design.
- **IBAX Network Integration**: Fully integrated with the IBAX blockchain for seamless operations.

## Getting Started

Follow these instructions to set up the multikey MultiSig Wallet on your local machine.

### Prerequisites

Ensure you have the following software installed:

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [pnpm](https://pnpm.io/) (v9.7 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/IBAX-io/multikey.git
cd multikey
```

2. Install the dependencies:

```bash
pnpm install
```

3. Start the application:

```bash
pnpm build
pnpm preview
```

4. Open your browser and navigate to:

```
http://localhost:4173
```

## Usage

1. **Create a MultiSig Wallet**:

- Navigate to the "Create Wallet" section.
- Define the number of required approvals and add the public keys of the participants.

2. **Manage Wallets**:

- View your existing MultiSig wallets and manage participants.

3. **Initiate a Transaction**:

- Propose a transaction and notify other participants for approval.

4. **Approve Transactions**:

- Review and approve pending transactions to meet the required number of approvals.

## Accessing the Wallet

The multikey MultiSig Wallet can be accessed at the following URL:

[https://multikey.ibax.network](https://multikey.ibax.network)

> **Note**: Replace `https://multikey.ibax.network` with the actual URL where your wallet application is hosted.

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please reach out to our team at [support@ibax.io](mailto:support@ibax.io).

---

Thank you for using multikey! We hope it enhances your experience with secure and collaborative fund management on the IBAX blockchain.
