export default function NotFound({ issue, relatedTo } : { issue?: string, relatedTo?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {issue ? issue : 'Not Found'}
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find the {relatedTo ? relatedTo : 'page'} you&apos;re looking for. It may have been
          removed or the subdomain is incorrect.
        </p>
      </div>

      <p className="text-sm text-gray-400 mt-8">© {new Date().getFullYear()}</p>
    </div>
  );
}
