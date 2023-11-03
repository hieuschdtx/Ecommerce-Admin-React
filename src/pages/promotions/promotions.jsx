import { Helmet } from 'react-helmet-async';
import { PromotionView } from 'src/sections/promotions/view';

export default function PrmotionPage() {
  return (
    <>
      <Helmet>
        <title>Promotion | MeatDeli</title>
      </Helmet>
      <PromotionView />
    </>
  );
}
