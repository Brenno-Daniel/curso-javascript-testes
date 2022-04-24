import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';

describe('ProductCard - unit tests', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '23.00',
        }),
      },
    });

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.html()).toContain('Relógio bonito');
    expect(wrapper.html()).toContain('$23.00');
  });

  it('should match snapshot', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '23.00',
          image:
            'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        }),
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
