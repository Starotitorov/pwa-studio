import React from 'react';
import testRenderer from 'react-test-renderer';
import Flow from '../flow';

import Cart from '../cart';
import Form from '../form';
import Receipt from '../Receipt';

jest.mock('../../../classify');
jest.mock('../form', () => 'Form');
jest.mock('../Receipt', () => 'Receipt');
jest.mock('../cart', () => 'Cart');

jest.mock('@magento/peregrine', () => {
    const state = {};
    const api = {
        addToast: jest.fn()
    };

    const useToasts = jest.fn(() => [state, api]);
    return {
        useToasts
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {};
    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});
jest.mock('@magento/peregrine/lib/context/checkout', () => {
    const state = {
        // availableShippingMethods,
        // billingAddress,
        // isSubmitting,
        // paymentData,
        // shippingAddress,
        // shippingAddressError,
        // shippingMethod,
        // shippingTitle
    };

    const api = {
        beginCheckout: jest.fn(),
        cancelCheckout: jest.fn(),
        submitOrder: jest.fn(),
        submitPaymentMethodAndBillingAddress: jest.fn(),
        submitShippingAddress: jest.fn(),
        submitShippingMethod: jest.fn()
    };

    const useCheckoutContext = jest.fn(() => [state, api]);

    return { useCheckoutContext };
});
jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {};

    const api = {};

    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});
const defaultProps = {
    cart: {
        details: {}
    },
    checkout: {}
};

test('renders Cart component', () => {
    const props = {
        ...defaultProps,
        step: 'cart'
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Cart)).not.toThrow();
});

test('renders Form component', () => {
    const props = {
        ...defaultProps,
        step: 'form'
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Form)).not.toThrow();
});

test('renders Receipt component', () => {
    const props = {
        ...defaultProps,
        step: 'receipt'
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Receipt)).not.toThrow();
});

// TODO: Rewrite this test for all invalid cases and not _just_ falsy.
test('renders null if checkout/cart props are falsy', () => {
    const props = {
        ...defaultProps,
        checkout: false,
        cart: false
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Cart)).toThrow();
    expect(() => component.root.findByType(Form)).toThrow();
    expect(() => component.root.findByType(Receipt)).toThrow();
});
