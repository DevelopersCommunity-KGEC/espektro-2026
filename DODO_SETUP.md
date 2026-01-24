# Dodo Payments Setup Guide

To accept payments, you must create a "Product" in Dodo Payments. We will create a generic "Espektro Ticket" product and use it for all bookings, overriding the price dynamically in the code.

## Option 1: Create via Dashboard (Recommended)

1. Log in to your [Dodo Payments Dashboard](https://app.dodopayments.com/).
2. Navigate to **Products**.
3. Click **Create Product**.
4. Fill in the details:
   - **Name**: `Espektro General Ticket`
   - **Description**: `Standard entry ticket for Espektro events.`
   - **Pricing Model**: `One-Time`
   - **Price**: `100` (This is a placeholder, strictly generic. The code will override this with the actual event price).
   - **Currency**: `INR`
5. Click **Create**.
6. Copy the **Product ID** (starts with `pdt_`).
7. Open your `.env` file and add:
   ```env
   DODO_PRODUCT_ID=pdt_your_copied_id_here
   ```
8. Restart your server (`npm run dev`).

## Verification

Once you have added `DODO_PRODUCT_ID` to your `.env` file, try booking a ticket again. The error `product_id Required` should disappear.
