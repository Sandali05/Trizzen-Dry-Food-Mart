import React from "react";

const About: React.FC = () => {
  return (
    <>
      {/* About Us Section with Background Image */}
      <section
        className="bg-cover bg-center bg-no-repeat py-16 px-4"
        style={{ backgroundImage: `url('https://png.pngtree.com/background/20230612/original/pngtree-supermarket-section-with-a-very-dark-aisle-picture-image_3180865.jpg')` }} // Replace with your image path
      >
        <div className="container mx-auto text-center p-10 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <h1 className="text-6xl font-bold mb-8 text-white py-8">About Us</h1>
          <p className="text-white text-lg leading-relaxed mb-6 py-8">
            Welcome to Trizzen, your trusted online supermarket for high-quality dry foods.
            At Trizzen, we believe in promoting a healthier lifestyle by offering fresh and
            nutritious food options that cater to a variety of tastes and preferences.
          </p>
          <p className="text-white text-lg leading-relaxed mb-6">
            Since our inception, we have been committed to sourcing the finest ingredients
            from local suppliers and delivering them straight to your door. Our goal is to
            make healthy eating easy, affordable, and accessible to everyone.
          </p>
          <p className="text-white text-lg leading-relaxed mb-6">
            Whether you're looking for whole grains, legumes, or dried fruits, we’ve got you covered.
            We are constantly expanding our product range to ensure that you have access to the latest
            and greatest in dry foods.
          </p>
        </div>
      </section>

      {/* Add space between sections */}
      <div className="py-8"></div>

      {/* Vision Section with Background Image */}
      <section
        className="bg-cover bg-center bg-no-repeat py-16 px-4"
        style={{ backgroundImage: `url('https://wallpapercave.com/wp/wp3152249.jpg')` }} // Replace with your image path
      >
        <div className="container mx-auto text-center p-10 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <h2 className="text-5xl font-semibold mb-8 text-white py-8">Our Vision</h2>
          <p className="text-white text-lg leading-relaxed mb-6 py-8">
            To be the leading provider of high-quality dry foods, fostering healthier communities 
            by making nutritious products accessible and affordable for everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Add space between sections */}
      <div className="py-8"></div>

      {/* Mission Section with Background Image */}
      <section
        className="bg-cover bg-center bg-no-repeat py-16 px-4"
        style={{ backgroundImage: `url('https://png.pngtree.com/background/20230618/original/pngtree-supermarket-alley-a-3d-modeling-of-a-shopping-cart-picture-image_3750842.jpg')` }} // Replace with your image path
      >
        <div className="container mx-auto text-center p-10 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <h2 className="text-5xl font-semibold mb-8 text-white py-8">Our Mission</h2>
          <p className="text-white text-lg leading-relaxed mb-6 py-8">
            To provide high-quality, sustainable food products that empower people to live healthier lives.
          </p>
        </div>
      </section>
    </>
  );
};

export default About;
