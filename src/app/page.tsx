import VolunteerScheduler from '@/components/volunteer-scheduler';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
          Registro de Voluntarios
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Selecciona una fecha y un horario para registrarte como voluntario.
        </p>
      </header>
      <VolunteerScheduler />
    </main>
  );
}
