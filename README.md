# EduTunisia
tunisian education website
EduTunisia AI
منصة تعليمية عربية RTL مبنية كبنية Next.js حديثة وقابلة للتوسع.

Stack
Next.js 15 App Router
TypeScript
Tailwind CSS
shadcn/ui style components
Zustand
React Hook Form + Zod
Recharts
TanStack Table
Lucide React
Sonner
Framer Motion
التشغيل
npm install
npm run dev
ثم افتح:

http://localhost:3000
البنية
src/app                 App Router routes
src/components/ui       Reusable shadcn-style UI
src/components/layout   Providers, protected pages, dashboard shell
src/features            Feature-based modules
src/lib                 Routes, utilities, mock data
src/store               Zustand stores
الأدوار التجريبية
صفحة تسجيل الدخول تسمح باختيار الدور، ثم توجه المستخدم إلى:

student: /student/dashboard
teacher: /teacher/dashboard
parent: /parent/dashboard
admin: /admin/dashboard
البيانات الحالية Mock ومهيأة للربط لاحقًا مع Django API.
