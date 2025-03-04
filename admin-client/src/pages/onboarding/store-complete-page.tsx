import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import discord_icon from '../../../public/images/discord_icon.png';
import facebook_icon from '../../../public/images/facebook_icon.png';
import twitter_icon from '../../../public/images/x_icon.png';

interface StoreCompletePageProps {
  onGoToDashboard: () => void;
}

const StoreCompletePage: React.FC<StoreCompletePageProps> = ({
  onGoToDashboard,
}) => {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <Card className="bg-black border-none w-full text-white">
        <CardHeader className="w-full text-center mb-8">
          <CardTitle className="font-inter font-bold text-2xl md:text-3xl text-left text-[#94D42A] mb-2">
            Congratulations! Your store is ready!
          </CardTitle>
          <p className="text-white text-sm md:text-base text-left">
            You’ve successfully set up your store on Hamza! Stay connected with our seller community on Discord, X (Twitter), and more to get updates, tips, and support. Now, start adding products, managing orders, and growing your business!
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center gap-16 mb-14">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full"
            >
              <img src={facebook_icon} alt="Facebook" className="w-12 h-12" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-13 h-12 rounded-full"
            >
              <img src={discord_icon} alt="Discord" className="w-13 h-12" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full"
            >
              <img src={twitter_icon} alt="Twitter" className="w-12 h-12" />
            </a>
          </div>


          <div className="flex justify-center">
            <Button
              onClick={onGoToDashboard}
              className="w-full h-14 bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full"
            >
              Go to dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreCompletePage;
