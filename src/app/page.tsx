"use client";

import Link from "next/link";
import { Star, Coffee, Clock, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/HeroSlider";

const bestsellers = [
  {
    name: "Cappuccino",
    desc: "Rich espresso with velvety steamed milk foam.",
    price: "₹149",
    img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Classic Cold Coffee",
    desc: "Creamy blended cold coffee perfection.",
    price: "₹179",
    img: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Paneer Tikka Pizza",
    desc: "Indian fusion pizza with spiced paneer tikka.",
    price: "₹195",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Sizzling Brownie",
    desc: "Hot brownie served on a sizzling plate.",
    price: "₹199",
    img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop"
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSlider />

      <section className="bg-brand-primary/10 py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="flex text-yellow-600">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <span className="font-medium">Google Rating 5.0 • 2,500+ Reviews</span>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Coffee, value: "50+", label: "Menu Items" },
              { icon: Users, value: "10K+", label: "Happy Customers" },
              { icon: Clock, value: "7AM-11PM", label: "Open Daily" },
              { icon: Award, value: "15+", label: "Awards Won" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 rounded-full bg-brand-primary/20 p-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-serif font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold">Our Bestsellers</h2>
          <div className="mx-auto mt-2 h-1 w-20 bg-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
          {bestsellers.slice(0, 4).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl ${i === 3 ? 'lg:hidden' : ''}`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-xl font-bold">{item.name}</h3>
                  <span className="font-bold text-primary text-sm md:text-base">{item.price}</span>
                </div>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground line-clamp-2">{item.desc}</p>
                <Button variant="ghost" className="mt-3 md:mt-4 w-full border border-primary/20 hover:bg-primary hover:text-white text-xs md:text-sm" asChild>
                  <Link href="/menu">Order Now</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-[#5d4a3a] py-16 text-white">
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold uppercase tracking-wider">
              Limited Time Offer
            </span>
            <h2 className="mb-4 text-4xl font-serif font-bold">Happy Hours: 3PM - 6PM</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-brand-primary/80">
              Get 20% off on all beverages! Perfect for your afternoon coffee break.
            </p>
            <Button asChild variant="outline" className="h-12 rounded-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-primary">
              <Link href="/offers">View All Offers</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1932&auto=format&fit=crop" 
                  alt="Cafe Republic Interior" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-brand-primary p-6 shadow-xl">
                <span className="text-4xl font-serif font-bold text-primary">5+</span>
                <p className="text-sm font-medium text-primary/80">Years of Excellence</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Coffee className="mb-6 h-12 w-12 text-primary" />
              <h2 className="mb-6 text-4xl font-serif font-bold">More Than Just Coffee</h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                At Cafe Republic, we believe in the art of the perfect brew and the warmth of a welcoming space. 
                Since 2019, we've been serving handcrafted beverages and delicious food made with love.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Whether you're here for a quick morning pick-me-up or a long afternoon session with friends, 
                we've got the perfect spot waiting for you.
              </p>
              <Button asChild className="h-12 rounded-full px-8">
                <Link href="/about">Read Our Story</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-serif font-bold">What Our Customers Say</h2>
            <div className="mx-auto mt-2 h-1 w-20 bg-primary" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Priya Sharma", text: "Best coffee in town! The ambiance is perfect for both work and casual meetups.", rating: 5 },
              { name: "Rahul Verma", text: "Their pasta is to die for. I come here every weekend with family.", rating: 5 },
              { name: "Anita Desai", text: "Love the cozy vibe and friendly staff. My go-to place for morning coffee.", rating: 5 },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex text-yellow-500">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">"{review.text}"</p>
                <p className="font-bold">— {review.name}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/reviews">See All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="container px-4 text-center">
          <h2 className="mb-4 text-3xl font-serif font-bold">Ready to Experience Cafe Republic?</h2>
          <p className="mx-auto mb-8 max-w-xl text-brand-primary/80">
            Visit us today or scan the QR code at your table to order directly from our menu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="h-14 rounded-full px-8">
              <Link href="/menu">Order Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-brand-primary px-8 text-brand-primary hover:bg-brand-primary hover:text-primary">
              <Link href="/contact">Get Directions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
