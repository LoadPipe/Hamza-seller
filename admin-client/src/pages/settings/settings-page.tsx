import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>

                {/* Account Information */}
                <Card className="bg-primary-black-90">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Button variant="outline" className="mb-4">
                                    Change Photo
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-red-500 mb-4"
                                >
                                    Remove Photo
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    At least 512 x 512 px PNG or JPG file. 1 MB
                                    maximum file size.
                                </p>
                            </div>
                            <div>
                                <Input
                                    placeholder="Full Name"
                                    className="mb-4"
                                />
                                <Input
                                    placeholder="Username"
                                    className="mb-4"
                                />
                                <Input
                                    placeholder="Phone Number"
                                    className="mb-4"
                                />
                                <Input
                                    placeholder="Email Address"
                                    className="mb-4"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="ghost" className="text-red-500">
                                Discard
                            </Button>
                            <Button>Update</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Business Information */}
                <Card className="bg-primary-black-90">
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                placeholder="Business Name"
                                className="mb-4"
                            />
                            <Input
                                placeholder="Registration Number"
                                className="mb-4"
                            />
                            <Input
                                placeholder="Tax Identification Number"
                                className="mb-4"
                            />
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Business Structure" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sole-proprietor">
                                        Sole Proprietor
                                    </SelectItem>
                                    <SelectItem value="llc">LLC</SelectItem>
                                    <SelectItem value="corporation">
                                        Corporation
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Textarea
                                placeholder="Business Registered Address"
                                rows={3}
                                className="mb-4 col-span-2"
                            />
                            <Input placeholder="City" className="mb-4" />
                            <Input placeholder="Country" className="mb-4" />
                            <Input
                                placeholder="Primary Contact Person"
                                className="mb-4"
                            />
                            <Input
                                placeholder="Email Address"
                                className="mb-4"
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="ghost" className="text-red-500">
                                Discard
                            </Button>
                            <Button>Update</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Store Information */}
                <Card className="bg-primary-black-90">
                    <CardHeader>
                        <CardTitle>Store Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="Store Name" className="mb-4" />
                        <div className="border border-dashed border-gray-500 rounded-lg p-4 text-center">
                            <p className="text-sm">
                                Drag and drop or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                                You can upload multiple images in PDF, JPG,
                                JPEG, PNG, GIF, or MP4 format (less than 5 MB).
                            </p>
                        </div>
                        <Textarea
                            placeholder="Store Description"
                            rows={3}
                            className="mt-4"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            <Input placeholder="Website" className="mb-4" />
                            <Input placeholder="Instagram" className="mb-4" />
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="ghost" className="text-red-500">
                                Discard
                            </Button>
                            <Button>Update</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Wallet/Payment Settings */}
                <Card className="bg-primary-black-90">
                    <CardHeader>
                        <CardTitle>Wallet/Payment Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                placeholder="Bank Account"
                                className="mb-4"
                            />
                            <Input placeholder="Email" className="mb-4" />
                            <div className="grid grid-cols-2 gap-4">
                                <Checkbox id="btc" />
                                <label htmlFor="btc">Bitcoin (BTC)</label>
                                <Checkbox id="usdc" />
                                <label htmlFor="usdc">USDC</label>
                                <Checkbox id="eth" />
                                <label htmlFor="eth">Ethereum (ETH)</label>
                                <Checkbox id="usdt" />
                                <label htmlFor="usdt">USDT</label>
                            </div>
                        </div>
                        <Textarea
                            placeholder="Payment instructions (e.g., manual confirmation required)"
                            rows={3}
                            className="mt-4"
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="ghost" className="text-red-500">
                                Discard
                            </Button>
                            <Button>Update</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
