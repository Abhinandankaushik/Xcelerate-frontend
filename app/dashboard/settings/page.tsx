'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Bell, Shield, Settings, Mail, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SettingsPage() {
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="h-8 w-8 text-primary" />
                    System Settings
                </h1>
                <p className="text-muted-foreground">
                    Configure compliance thresholds, notifications, and application preferences.
                </p>
            </div>

            {saved && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Configuration saved successfully.</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="thresholds" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="thresholds">Compliance Thresholds</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="general">General</TabsTrigger>
                </TabsList>

                <TabsContent value="thresholds">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compliance Sensitivity</CardTitle>
                            <CardDescription>Adjust the sensitivity of the AI models for flagging violations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Max Allowed Encroachment (%)</label>
                                    <span className="text-sm text-muted-foreground">5%</span>
                                </div>
                                <Slider defaultValue={[5]} max={20} step={1} className="w-full" />
                                <p className="text-xs text-muted-foreground">
                                    Industries with deviation exceeding this value will be marked as "Violation".
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">AI Confidence Threshold (%)</label>
                                    <span className="text-sm text-muted-foreground">75%</span>
                                </div>
                                <Slider defaultValue={[75]} max={100} step={5} className="w-full" />
                                <p className="text-xs text-muted-foreground">
                                    Minimum confidence score required for automated flagging.
                                </p>
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">Auto-Flag High Risk Industries</label>
                                    <span className="text-xs text-muted-foreground">Automatically flag Chemical/Power industries for stricter checks.</span>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alert Preferences</CardTitle>
                            <CardDescription>Manage how and when you receive compliance alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">Email Notifications</label>
                                    <span className="text-xs text-muted-foreground">Receive daily summaries of violations.</span>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">SMS Alerts</label>
                                    <span className="text-xs text-muted-foreground">Urgent alerts for critical violations (&gt;20% encroachment).</span>
                                </div>
                                <Switch />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alert Recipients (Email)</label>
                                <Input placeholder="admin@csidc.gov.in, supervisor@csidc.gov.in" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Application wide preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium">Dark Mode</label>
                                    <span className="text-xs text-muted-foreground">Toggle application theme (System default by default).</span>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Data Refresh Rate</label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" placeholder="24" className="w-24" />
                                    <span className="text-sm text-muted-foreground">Hours</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Frequency of automated satellite data fetching.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
