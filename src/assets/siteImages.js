const asset = (path) => new URL(path, import.meta.url).href

export const siteImages = {
  logo: asset('./LOGO.png'),
  apple: asset('./pic assets/apple drink.png'),
  checking: asset('./pic assets/CHECKING.png'),
  clearLemon: asset('./pic assets/clear lemon.png'),
  cola: asset('./pic assets/cola.png'),
  companyOverview: asset('./pic assets/COMPANY-OVERVIEW.png'),
  dispatch: asset('./pic assets/DISPATCH.png'),
  filling: asset('./pic assets/FILLING.png'),
  flavours1: asset('./pic assets/FLAVOURS 1.png'),
  flavours2: asset('./pic assets/flavours 2.png'),
  grape: asset('./pic assets/grape drink.png'),
  greenLemon: asset('./pic assets/lemon.png'),
  jeera: asset('./pic assets/jeera.png'),
  labelling: asset('./pic assets/LABELLING.png'),
  lemon: asset('./pic assets/lemon.png'),
  mango: asset('./pic assets/mango.png'),
  mangoDrink: asset('./pic assets/mango drink.png'),
  mango2: asset('./pic assets/mango drink.png'),
  orange: asset('./pic assets/orange.png'),
  ourProducts: asset('./pic assets/OUR PRODUCTS.png'),
  packing: asset('./pic assets/PACKING.png'),
  paneerSoda: asset('./pic assets/panner soda.png'),
  pineapple: asset('./pic assets/pine apple.png'),
  preparation: asset('./pic assets/PREPARATION.png'),
  saltLemon: asset('./pic assets/salt lemon.png'),
  storageArea: asset('./pic assets/STORAGE AREA.png'),
  whiteLemon: asset('./pic assets/clear lemon.png'),
}

export default siteImages
