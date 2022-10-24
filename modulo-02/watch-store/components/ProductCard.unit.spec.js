import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';
import { cartState } from '@/state';

describe('ProductCard - unit tests', () => {
  const mountProductCard = () => {
    const product = server.create('product', {
      title: 'Relógio bonito',
      price: '23.00',
      image:
        'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    });

    return {
      wrapper: mount(ProductCard, {
        propsData: {
          product,
        },
      }),
      product,
    };
  };

  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.html()).toContain('Relógio bonito');
    expect(wrapper.html()).toContain('$23.00');
  });

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.element).toMatchSnapshot();
  });

  xit('should add item to cartState on button click', async () => {
    const { wrapper } = mountProductCard();

    await wrapper.find('button').trigger('click');

    expect(cartState.items).toHaveLength(1);
  });
});
