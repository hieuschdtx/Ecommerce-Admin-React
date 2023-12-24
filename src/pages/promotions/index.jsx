import { Helmet } from 'react-helmet-async';
import { PromotionView } from 'src/sections';

export default function PrmotionPage() {
  return (
    <>
      <Helmet>
        <title>Khuyến mãi | MeatDeli</title>
      </Helmet>
      <PromotionView />
    </>
  );
}
