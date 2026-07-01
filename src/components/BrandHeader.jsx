import logo from '../assets/skin-logo.png';

export default function BrandHeader() {
  return (
    <div className="brand-header">
      <div className="brand-header__logo-wrap">
        <img
          className="brand-header__logo"
          src={logo}
          alt="Nepalgunj Skin Center logo"
        />
      </div>
      <span className="brand-header__name">Nepalgunj Skin Center</span>
    </div>
  );
}
