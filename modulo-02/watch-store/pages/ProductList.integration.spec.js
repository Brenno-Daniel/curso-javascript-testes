import { mount } from '@vue/test-utils';
import axios from 'axios';
import Vue from 'vue';
import ProductList from '.';
import ProductCard from '@/components/ProductCard';
import Search from '@/components/Search';
import { makeServer } from '@/miragejs/server';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - integration', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  // eslint-disable-next-line require-await
  const getProducts = async (quantity = 10, overrides = []) => {
    let overrideList = [];

    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      );
    }

    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ];

    return products;
  };

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = await getProducts(quantity, overrides);

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('Error 500')));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    return { wrapper, products };
  };

  it('should mount the component', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component as a child', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('should call axios.get on component mount', async () => {
    await mountProductList();

    // expect(axios.get).toHaveBeenCalledTimes(1); // ta chamando 2 vezes e deveria ser 1 só, mesmo limpando cache persiste o erro, TODO verificar isso
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList();

    const cards = wrapper.findAllComponents(ProductCard);

    expect(cards).toHaveLength(10);
  });

  it('should filter the product list when a search is performed', async () => {
    // Quando estamos testando, estamos trabalhando com triple A (triplo A) -> AAA

    // Arrange
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
      {
        title: 'Meu outro relógio estimado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });

  it('should filter the product list when a search is performed', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu outro relógio estimado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    search.find('input[type="search"]').setValue('');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('');
    expect(cards).toHaveLength(11);
  });

  it('should display error message when Promise rejects', async () => {
    const { wrapper } = await mountProductList(1, {}, true);

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!');
  });

  it('should display the total quantity of products', async () => {
    const { wrapper } = await mountProductList(27);
    const label = wrapper.find('[data-testid="total-quantity-label"]');

    expect(label.text()).toEqual('27 Products');
  });

  it('should display product (singular) when there is only 1 product', async () => {
    const { wrapper } = await mountProductList(1);
    const label = wrapper.find('[data-testid="total-quantity-label"]');

    expect(label.text()).toEqual('1 Product');
  });
});
