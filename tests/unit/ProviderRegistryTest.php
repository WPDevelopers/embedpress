<?php
/**
 * Auto-generated test: verifies all providers in providers.php exist and are valid.
 *
 * @package EmbedPress\Tests\Unit
 */

namespace EmbedPress\Tests\Unit;

use PHPUnit\Framework\TestCase;

class ProviderRegistryTest extends TestCase
{
    private function getProviderRegistry(): array
    {
        // Simulate the providers.php file without WordPress
        return [
            'EmbedPress\Providers\GoogleMaps' => ['google.com'],
            'EmbedPress\Providers\GoogleDrive' => ['drive.google.com'],
            'EmbedPress\Providers\GooglePhotos' => ['photos.google.com'],
            'EmbedPress\Providers\GoogleDocs' => ['docs.google.com'],
            'EmbedPress\Providers\GoogleCalendar' => ['calendar.google.com'],
            'EmbedPress\Providers\Twitch' => ['twitch.tv'],
            'EmbedPress\Providers\Giphy' => ['giphy.com'],
            'EmbedPress\Providers\Boomplay' => ['boomplay.com'],
            'EmbedPress\Providers\Youtube' => ['youtube.com'],
            'EmbedPress\Providers\OpenSea' => ['opensea.io'],
            'EmbedPress\Providers\NRKRadio' => ['radio.nrk.no'],
            'EmbedPress\Providers\GitHub' => ['github.com'],
            'EmbedPress\Providers\InstagramFeed' => ['instagram.com'],
            'EmbedPress\Providers\Gumroad' => ['gumroad.com'],
            'EmbedPress\Providers\X' => ['x.com'],
            'EmbedPress\Providers\Calendly' => ['calendly.com'],
            'EmbedPress\Providers\LinkedIn' => ['linkedin.com'],
            'EmbedPress\Providers\Spreaker' => ['spreaker.com'],
            'EmbedPress\Providers\AirTable' => ['airtable.com'],
            'EmbedPress\Providers\Canva' => ['canva.com'],
            'EmbedPress\Providers\OneDrive' => ['onedrive.live.com'],
            'EmbedPress\Providers\FITE' => ['fite.tv'],
            'EmbedPress\Providers\Meetup' => ['meetup.com'],
            'EmbedPress\Providers\GettyImages' => ['gettyimages.com'],
            'EmbedPress\Providers\Wistia' => ['wistia.com'],
        ];
    }

    public function test_all_registered_providers_exist(): void
    {
        foreach ($this->getProviderRegistry() as $className => $hosts) {
            $this->assertTrue(
                class_exists($className),
                "Registered provider class does not exist: {$className}"
            );
        }
    }

    public function test_all_registered_providers_implement_interface(): void
    {
        foreach ($this->getProviderRegistry() as $className => $hosts) {
            if (!class_exists($className)) {
                $this->markTestSkipped("Class not found: {$className}");
            }

            $this->assertTrue(
                is_subclass_of($className, \Embera\Provider\ProviderAdapter::class),
                "{$className} must extend ProviderAdapter"
            );
        }
    }

    public function test_all_registered_providers_have_hosts(): void
    {
        foreach ($this->getProviderRegistry() as $className => $hosts) {
            if (!class_exists($className)) {
                continue;
            }

            $reflection = new \ReflectionClass($className);
            $providerHosts = $reflection->getStaticPropertyValue('hosts');
            $this->assertNotEmpty(
                $providerHosts,
                "{$className} has no hosts defined"
            );
        }
    }

    public function test_all_provider_files_have_matching_class(): void
    {
        $providersDir = dirname(__DIR__, 2) . '/EmbedPress/Providers';
        $files = glob($providersDir . '/*.php');

        $skipFiles = ['Wrapper.php', 'SelfHosted.php'];

        foreach ($files as $file) {
            $basename = basename($file);
            if (in_array($basename, $skipFiles)) {
                continue;
            }

            $className = 'EmbedPress\\Providers\\' . basename($file, '.php');
            $this->assertTrue(
                class_exists($className),
                "Provider file {$basename} exists but class {$className} could not be loaded"
            );
        }
    }
}