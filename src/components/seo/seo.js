import Head from 'next/head';
import PropTypes from 'prop-types';

function SEO({ description, title, siteTitle, imgURL }) {
  return (
    <Head>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:image" content={imgURL} />
      <meta property="twitter:card" content="summary" />
      {/* <meta property="twitter:creator" content={config.social.twitter} /> */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  );
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  siteTitle: PropTypes.string,
  imgURL: PropTypes.string
};

SEO.defaultProps = {
  description:
    'The world’s largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital assets.',
  siteTitle: 'Gaia',
  imgURL: '/static/img/main-unfurl.png'
};

export default SEO;
